# **Technical White Paper: Jetson Field Kit Architecture**
## Complete Hardware and Software Specification for Deploying AI Agents in the Field

**Document Version:** 1.0
**Date:** October 26, 2023
**Classification:** Buildable Open Specification

---

### **Executive Summary**

The Jetson Field Kit (JFK) is a hardened, portable AI deployment system designed to enable a single technician to perform complex diagnostic, documentation, and implementation tasks in remote or challenging environments. Centered on the NVIDIA Jetson Super Orin Nano platform, it combines robust hardware with a meticulously crafted software stack to provide an AI co-pilot that operates seamlessly across connectivity states—from high-bandwidth cloud links to fully air-gapped local inference.

This white paper provides the complete architectural specification, from physical assembly to boot sequence and software pipeline. It is designed to be a buildable guide, with explicit commands, file paths, and configurations, enabling the replication of a system that turns a ruggedized case into a field-deployable AI agent capable of real-time multimodal interaction and technical synthesis.

---

### **1.0 Hardware Architecture: The Physical Platform**

#### **1.1 Core Compute Unit**
- **Module:** NVIDIA Jetson Super Orin Nano Developer Kit (8GB Shared GPU/System RAM).
- **Rationale:** The 8GB model provides the optimal balance of CUDA capability, power efficiency (10-20W), and form factor. The Super Orin Nano's Arm Cortex-A78AE cores and 1024-core NVIDIA Ampere architecture GPU deliver sufficient performance for local inference while staying within the thermal and power constraints of a portable deployment.
- **Storage:** Crucial P3 Plus 2TB NVMe M.2 2280 SSD.
    - **Justification:** 2TB provides ample space for models, high-resolution image/video logs, and local git repositories. The NVMe interface ensures rapid system cloning and model loading.

#### **1.2 Deployment Enclosure & Power**
- **Primary Enclosure:** Pelican 1450 Case with custom laser-cut high-density polyethylene (HDPE) insert.
- **Power Supply:**
    1. **Primary:** 12V DC Marine/RV Input (5.5mm x 2.1mm barrel jack, center positive). Uses a wide-input (9-36V) DC-DC converter to provide a stable 12V/5A to the Jetson's official power input header.
    2. **Secondary:** 802.3bt PoE++ (Power over Ethernet) via an external 95W injector and a PoE HAT for the Jetson. Enables single-cable deployment for power and data.
- **Cooling:** The Pelican insert design incorporates passive ventilation channels. The Jetson's native heatsink/fan assembly is retained. The case is never operated while fully sealed during active compute.

#### **1.3 Connectivity & Peripherals**
- **Network:**
    - Onboard 1GbE RJ-45 (used for PoE or direct LAN connection).
    - Intel AX210NGW WiFi 6E M.2 card (in M.2 Key E slot) for `jetson.local` mDNS announcements and client-mode connections to boat WiFi.
- **External I/O:**
    - Front-panel passthrough for:
        - USB-C 3.2 (for phone tethering)
        - 2x USB-A 3.0 (for cameras/peripherals)
        - HDMI 2.1 (for debug display)
    - Internal cabling to rear-panel passthrough for:
        - 12V Power Input
        - RJ-45 Ethernet
- **Optional Sensor Suite:**
    - **Engine Room:** Arducam 12MP IMX477 CSI camera with wide-angle lens and protective housing.
    - **Thermal Imaging:** Topdon TC001 USB-C thermal camera (160x120 res).
    - **Deck Cameras:** Standard USB webcams (Logitech C920x) with weatherproof housings.

---

### **2.0 Boot Sequence & Provisioning**

The system is designed for zero-touch provisioning by a field technician. The entire process from unboxing to operational AI agent takes under 10 minutes.

#### **2.1 Pre-Flashed SD Card (The "Ignition Key")**
A 32GB SanDisk Extreme Pro SD card is pre-flashed with a minimal, customized Ubuntu 22.04 LTS image using the NVIDIA SDK Manager.

**Image Contents (`/` on SD card):**
- Base JetPack 6.x (Ubuntu 22.04, Kernel 5.15)
- Custom `firstboot.service` systemd unit
- Provisioning scripts in `/opt/provision/`
- SSH keys for initial tech access (pubkey only)

#### **2.2 Automated Boot Process**
**Step 1: Technician Action**
```
1. Insert NVMe SSD into M.2 slot (M key).
2. Insert pre-flashed SD card into SD slot.
3. Connect 12V power. System boots automatically.
```

**Step 2: SD Card Boot & Detection**
The `firstboot.service` executes on first boot:
```bash
# /etc/systemd/system/firstboot.service
[Service]
Type=oneshot
ExecStart=/opt/provision/check_nvme.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

`/opt/provision/check_nvme.sh`:
```bash
#!/bin/bash
# Check if NVMe is present and has a partition
if [ -b /dev/nvme0n1 ] && ! lsblk /dev/nvme0n1p1 > /dev/null 2>&1; then
    # NVMe is blank, trigger clone
    /opt/provision/clone_to_nvme.sh
fi
```

**Step 3: Clone to NVMe**
`/opt/provision/clone_to_nvme.sh`:
```bash
#!/bin/bash
# 1. Create partitions: 512MB ESP, remainder ext4
parted /dev/nvme0n1 mklabel gpt
parted /dev/nvme0n1 mkpart primary fat32 1MiB 513MiB
parted /dev/nvme0n1 set 1 esp on
parted /dev/nvme0n1 mkpart primary ext4 513MiB 100%

# 2. Format
mkfs.fat -F 32 /dev/nvme0n1p1
mkfs.ext4 /dev/nvme0n1p2

# 3. Mount and clone
mount /dev/nvme0n1p2 /mnt
rsync -axHAWX --numeric-ids --info=progress2 / /mnt

# 4. Install bootloader to NVMe ESP
mount /dev/nvme0n1p1 /mnt/boot/efi
chroot /mnt /usr/sbin/grub-install --target=arm64-efi /dev/nvme0n1
chroot /mnt update-grub

# 5. Update fstab to use NVMe UUID
NVME_UUID=$(blkid -s UUID -o value /dev/nvme0n1p2)
sed -i "s|^UUID=.* / ext4|UUID=${NVME_UUID} / ext4|" /mnt/etc/fstab

# 6. Disable firstboot.service on target
chroot /mnt systemctl disable firstboot

# 7. Signal reboot
sync
echo "CLONE_COMPLETE" > /tmp/clone_status
reboot
```
*Process takes approximately 5 minutes for a 8GB root filesystem.*

**Step 4: NVMe Boot & Service Startup**
The system reboots from the NVMe. The primary startup sequence begins:
```bash
# /etc/systemd/system/multi-user.target.wants/
# 1. network-online.target
# 2. jetson-field-kit.service
```

`/etc/systemd/system/jetson-field-kit.service`:
```ini
[Unit]
Description=Jetson Field Kit Master Service
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/opt/captain/scripts/startup.sh
ExecStop=/opt/captain/scripts/shutdown.sh
User=captain
Group=captain

[Install]
WantedBy=multi-user.target
```

#### **2.3 Network Announcement & Bot Online**
The `startup.sh` script:
1.  Starts the `avahi-daemon` for `jetson.local` mDNS.
2.  Launches the Starlette web server on port 8080.
3.  Starts the Telegram/Discord bot polling process.
4.  Sends a system status message to the pre-configured Telegram/Discord channel.

**Technician Experience at this Point:**
- Technician's phone receives Telegram notification: *"JFK-7341 online at jetson.local. Power: 12V. Storage: 1.8TB free."*
- Technician can immediately open Telegram and begin conversation.
- Web UI is accessible at `http://jetson.local:8080` on the local WiFi network.

---

### **3.0 Software Stack & File System Layout**

#### **3.1 Base Operating System**
- **OS:** Ubuntu 22.04 LTS (JetPack 6.x baseline)
- **Kernel:** Linux 5.15 (NVIDIA customized)
- **Critical Packages:**
    ```bash
    # Python & Dev
    python3.10-full python3.10-venv pipx
    nodejs18 npm
    build-essential cmake git-lfs

    # System
    avahi-daemon libavahi-compat-libdnssd-dev
    network-manager usb-modeswitch

    # Media
    ffmpeg pulseaudio libportaudio2
    ```

#### **3.2 File System Hierarchy**
All application code, models, and data reside under `/opt/captain/`:
```
/opt/captain/
├── models/              # All AI models, versioned
│   ├── stt/
│   │   ├── whisper-tiny.en.bin
│   │   └── config.json
│   ├── llm/
│   │   ├── phi-3-mini-4k-instruct-q4.gguf
│   │   └── tokenizer.json
│   └── tts/
│       ├── en_US-amy-low.onnx
│       └── piper_voices.json
├── repos/               # Git repositories for each project
│   ├── engine-monitor-<boat-id>/
│   ├── electrical-map-<boat-id>/
│   └── deck-safety-<boat-id>/
├── data/                # SQLite DB, logs, uploaded media
│   ├── fieldkit.db
│   ├── sessions/
│   └── uploads/
├── web/                 # Starlette web app
│   ├── static/
│   ├── templates/
│   └── server.py
├── scripts/             # System management
│   ├── startup.sh
│   ├── model_manager.py
│   └── connectivity_monitor.py
└── config/
    ├── telegram_bot.json
    ├── discord_bot.json
    └── system_config.yaml
```

#### **3.3 Core AI Services**

**3.3.1 Local Inference with llama.cpp**
- **Version:** llama.cpp compiled with CUDA support for Jetson.
- **Compilation:**
    ```bash
    git clone https://github.com/ggerganov/llama.cpp
    cd llama.cpp
    make -j4 LLAMA_CUBLAS=1
    ```
- **Model:** Microsoft Phi-3-mini-4k-instruct-Q4 (3.8B parameters, ~2.2GB GGUF).
- **Run Command:**
    ```bash
    ./server -m /opt/captain/models/llm/phi-3-mini-4k-instruct-q4.gguf \
             -c 2048 -ngl 35 --host 0.0.0.0 --port 8081
    ```
    *The `-ngl 35` offloads 35 layers to the GPU (approx 2GB VRAM).*

**3.3.2 Speech-to-Text (STT) Pipeline**
- **Local:** `whisper.cpp` (OpenAI Whisper Tiny) for low-latency, offline commands.
    ```bash
    ./stream -m /opt/captain/models/stt/whisper-tiny.en.bin -t 4 --step 500 --length 5000
    ```
- **Cloud Fallback:** When connectivity exists, audio is sent to OpenAI Whisper API for superior accuracy on technical jargon.

**3.3.3 Text-to-Speech (TTS) Pipeline**
- **Local:** Piper TTS with the `en_US-amy-low` voice (ONNX runtime).
    ```bash
    echo "$TEXT" | ./piper --model /opt/captain/models/tts/en_US-amy-low.onnx --output_raw | aplay -r 22050 -f S16_LE -t raw -
    ```
- **Cloud Fallback:** ElevenLabs API for more natural intonation when online.

#### **3.4 Memory Management & Model Swapping**
The 8GB shared memory is a critical constraint. The system employs an aggressive unloading policy.

**`/opt/captain/scripts/model_manager.py`**:
```python
import psutil
import subprocess
import time

MODEL_STATES = {
    'stt': 'unloaded',
    'llm': 'unloaded',
    'tts': 'unloaded'
}

def unload_all_but(model_to_keep):
    """Unload all GPU models except the specified one."""
    for model in ['stt', 'llm', 'tts']:
        if model != model_to_keep and MODEL_STATES[model] == 'loaded':
            # Send SIGTERM to process
            subprocess.run(['pkill', '-f', f'{model}_server'])
            MODEL_STATES[model] = 'unloaded'
            time.sleep(1)  # Allow GPU memory to free

def check_memory():
    """Return available GPU memory in MB."""
    result = subprocess.run(['tegrastats', '--interval', '1000', '--count', '1'],
                           capture_output=True, text=True)
    # Parse output: RAM 1912/7878MB (lfb 84x4MB) SWAP 0/3967MB (cached 0MB)
    # Focus on GPU memory (shared pool)
    import re
    ram_match = re.search(r'RAM (\d+)/(\d+)MB', result.stdout)
    if ram_match:
        used = int(ram_match.group(1))
        total = int(ram_match.group(2))
        return total - used
    return 4096  # Conservative default
```

**Pipeline Execution Flow:**
1.  User speaks command via Telegram voice note.
2.  `model_manager.unload_all_but('stt')`
3.  Load Whisper, transcribe audio, unload Whisper.
4.  Text sent to LLM queue.
5.  `model_manager.unload_all_but('llm')`
6.  Load Phi-3, generate response, unload Phi-3.
7.  If voice response needed: `model_manager.unload_all_but('tts')`
8.  Load Piper, synthesize audio, unload Piper.

*This ensures peak GPU memory usage never exceeds ~4GB.*

#### **3.5 Communication Services**

**3.5.1 Telegram/Discord Bot (`/opt/captain/bot/bot_core.py`)**
```python
from telegram.ext import Application, MessageHandler, filters
import asyncio

class FieldKitBot:
    def __init__(self):
        self.llm_url = "http://localhost:8081"
        self.active_sessions = {}

    async def handle_message(self, update, context):
        user_id = update.effective_user.id
        msg = update.message

        # Handle photo
        if msg.photo:
            file = await msg.photo[-1].get_file()
            path = f"/opt/captain/data/uploads/{user_id}_{msg.id}.jpg"
            await file.download_to_drive(path)
            await self.analyze_image(path, user_id)

        # Handle voice
        if msg.voice:
            file = await msg.voice.get_file()
            audio_path = f"/opt/captain/data/uploads/{user_id}_{msg.id}.ogg"
            await file.download_to_drive(audio_path)
            text = await self.transcribe_audio(audio_path)
            await self.process_query(text, user_id)

        # Handle text
        if msg.text:
            await self.process_query(msg.text, user_id)
```

**3.5.2 Local Web Interface (Starlette)**
`/opt/captain/web/server.py`:
```python
from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
import sqlite3

app = Starlette(debug=True)

@app.route('/api/status')
async def status(request):
    return JSONResponse({
        'system': 'Jetson Field Kit',
        'models_loaded': list(MODEL_STATES.items()),
        'storage': shutil.disk_usage('/opt/captain')
    })

app.mount('/static', StaticFiles(directory='static'), name='static')
```

**3.5.3 Cloud Connectivity (Cloudflare Tunnel)**
```bash
# Installed as a systemd service
/usr/local/bin/cloudflared tunnel --config /opt/captain/config/cloudflared.yaml run fieldkit-tunnel
```

Configuration (`/opt/captain/config/cloudflared.yaml`):
```yaml
tunnel: fieldkit-tunnel
credentials-file: /opt/captain/config/cloudflared_creds.json
ingress:
  - hostname: jfk-7341.fieldkit.tech
    service: http://localhost:8080
  - hostname: bot-api.fieldkit.tech
    service: http://localhost:8082
  - service: http_status:404
```

---

### **4.0 Connectivity Management**

The system dynamically manages three connection tiers:

#### **4.1 Tier 1: Primary (Boat WiFi/Starlink)**
```bash
# /etc/netplan/99-fieldkit.yaml
network:
  version: 2
  wifis:
    wlan0:
      dhcp4: yes
      access-points:
        "Boat-Network":
          password: "s3cur3p@ss"
```
- **Use Case:** High-bandwidth operations (video upload, cloud model inference).
- **Failover Detection:** Continuous ping to 8.8.8.8. If latency >2000ms for 30s, trigger fallback.

#### **4.2 Tier 2: Fallback (USB Phone Tethering)**
```bash
# Script triggered by udev rule on USB tether detection
#!/bin/bash
sudo nmcli con import type file file /etc/NetworkManager/system-connections/*.mobile
sudo nmcli con up "Tethering"
```
- **Use Case:** Text/voice communication, small image transfers.
- **Bandwidth:** Limited to ~5Mbps, disables video streaming.

#### **4.3 Tier 3: Air-Gapped (Full Local)**
- **Mode:** Automatic when no Tier 1 or 2 connectivity for 2 minutes.
- **Behavior:**
    - Notifies user: "Now operating in local-only mode. Cloud APIs unavailable."
    - Falls back to Whisper.cpp and Piper TTS exclusively.
    - LLM remains fully functional via llama.cpp.
    - All git operations are local commits; sync deferred.

#### **4.4 Connectivity Monitor (`/opt/captain/scripts/connectivity_monitor.py`)**
```python
import asyncio
import subprocess

class ConnectivityManager:
    TIERS = {
        'ethernet': {'interface': 'eth0', 'required_bandwidth': 10},
        'wifi': {'interface': 'wlan0', 'required_bandwidth': 5},
        'tether': {'interface': 'usb0', 'required_bandwidth': 1}
    }

    async def assess_tier(self):
        for tier_name, tier_info in self.TIERS.items():
            if self.interface_up(tier_info['interface']):
                if await self.bandwidth_test(tier_info):
                    return tier_name
        return 'airgapped'
```

---

### **5.0 The Technician's Workflow: A Narrative Specification**

#### **5.1 Deployment Scenario: Engine Monitoring Installation**

**08:00 - Arrival**
- Technician boards vessel "M/V Horizon".
- Places Pelican case in wheelhouse, connects to boat's 12V system.
- **System Log:**
    ```
    [INFO] Power detected: 12.4V
    [INFO] NVMe found, booting from /dev/nvme0n1p2
    [INFO] Startup complete. Web UI: http://jetson.local:8080
    [INFO] Telegram bot online. Sent greeting to channel.
    ```

**08:05 - Initial Interaction**
*Technician opens Telegram on phone (connected to boat WiFi):*

**Tech:** "Hey, I'm on the M/V Horizon. Captain wants engine monitoring for the main Caterpillar C18."

**JFK Bot:** *"Good morning. I've initialized a new project repository at `/opt/captain/repos/engine-monitor-horizon`. Let's start with a baseline. Can you send me photos of: 1) The engine control panel, 2) The engine block from both sides, 3) Any existing sensor wiring?"*

**Tech:** Sends 8 photos over 2 minutes.

**JFK Bot:** *"Analyzed. I see a Caterpillar C18 with electronic control module (ECM) version 3.2. I've identified potential mounting points for accelerometers and IR temperature sensors. Let's build a requirements doc."*

**08:20 - Collaborative Documentation**
The bot creates `/opt/captain/repos/engine-monitor-horizon/README.md`:
```markdown
# M/V Horizon - Engine Monitoring System

## Components Identified
1. Vibration: 2x ADXL345 I2C accelerometers (port/stbd mounts)
2. Temperature: 3x MLX90614 IR non-contact sensors (exhaust manifold, turbo, coolant housing)
3. Data Acquisition: Raspberry Pi Pico W (via USB to Jetson)

## Wiring Diagram
![diagram](wiring_diagram.svg) *Auto-generated from photo analysis*

## Installation Steps
1. Mount accelerometers using M6 bolts at locations marked in photo horizon_engine_port.jpg
2. Run shielded 4-conductor cable along existing wire chase...
```

*The technician reviews, makes voice comments: "We should use the existing conduit near the starboard side."*

**JFK Bot:** *"Updated diagram. I've also generated the Pico W MicroPython code. You can flash it now."*

**08:45 - Code Generation**
The bot writes `/opt/captain/repos/engine-monitor-horizon/pico/main.py`:
```python
import machine
from adxl345 import ADXL345
import ujson
import time

i2c = machine.I2C(0, scl=machine.Pin(5), sda=machine.Pin(4))
accel = ADXL345(i2c)

while True:
    x, y, z = accel.get_xyz()
    data = {'vibration': {'x': x, 'y': y, 'z': z},
            'timestamp': time.time()}
    print(ujson.dumps(data))
    time.sleep(0.1)
```

**09:30 - Installation Validation**
Technician installs sensors, connects Pico W to Jetson via USB.
Sends photo of installation.

**JFK Bot:** *"I can see the Pico is connected at /dev/ttyACM0. Starting data validation. [Plots vibration frequency spectrum]. Looks good - peak at 87Hz matches expected idle vibration. Installation validated. Committing to git."*

**10:00 - Final Documentation**
System auto-generates:
1. Complete installation manual (PDF)
2. Parts list with supplier links
3. Maintenance schedule
4. Git repository with full history of the session

*Every technician interaction, photo, and generated file is committed with descriptive messages:*
```bash
git log --oneline
# a1b2c3d Added vibration analysis results
# f4e5d6c Updated wiring diagram per technician feedback
# c7b8a9f Initial sensor placement photos
```

---

### **6.0 Maintenance & Updates**

#### **6.1 Over-the-Air Updates**
When cloud connectivity is available:
```bash
sudo crontab -u captain -e
# Add: 0 2 * * * /opt/captain/scripts/update_check.py
```

`/opt/captain/scripts/update_check.py`:
```python
# Checks for:
# 1. Security updates (apt)
# 2. New model versions (git LFS)
# 3. Application code updates
# Requires manual approval via Telegram: "Update available. Approve?"
```

#### **6.2 Data Backup Strategy**
- **Local:** Nightly `rsync` of `/opt/captain/repos/` to external USB drive if connected.
- **Cloud:** When online, encrypted push to private GitHub repository.
- **Critical Data:** SQLite database backed up hourly with WAL (Write-Ahead Logging).

#### **6.3 Recovery Mode**
Hold physical button on Jetson carrier board during boot to enter recovery:
1.  Mounts SD card as read-write
2.  Starts SSH server on static IP 192.168.55.1
3.  Provides command-line access for full system restore

---

### **7.0 Performance Specifications**

- **Boot Time (SD to NVMe):** 5-7 minutes (first boot only)
- **Boot Time (NVMe):** 45 seconds
- **LLM Inference Speed:** 15-20 tokens/sec (Phi-3-mini Q4)
- **STT Latency:** 800ms (Whisper Tiny, local)
- **TTS Latency:** 300ms (