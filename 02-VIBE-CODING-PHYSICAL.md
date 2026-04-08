# **Technical White Paper: Vibe-Coding Physical Systems**

**A Framework for Human-AI Collaboration in the Design and Installation of Marine Physical Systems**

**Version:** 1.0
**Date:** October 26, 2023
**Authors:** Systems Integration Research Group
**Domain:** Marine/Commercial Fishing Vessel Systems

---

## **Abstract**

This white paper introduces and formalizes the concept of **Vibe-Coding for Physical Systems (VCPS)**, a novel framework that extends the rapid, iterative, and intuitive collaboration paradigm of AI-assisted software development ("vibe-coding") to the domain of physical system design, installation, and maintenance. Traditionally, the integration of complex systems on vessels—such as engine monitoring, safety networks, or catch management systems—involves labor-intensive surveying, manual drafting, and siloed knowledge. VCPS reimagines this process by positioning the field technician as a **physical-world subagent** in a collaborative loop with an AI orchestrator. The technician provides real-world context via natural language and photographs, while the AI processes this multimodal input to generate actionable designs, step-by-step installation guides, and a living, Git-native documentation system. Using concrete examples from the marine and commercial fishing industry, this paper details the VCPS workflow, the critical "Photo Protocol," the implementation of vision models for scene understanding, and the resulting "Git-Native Installation Manual." The result is a transformative methodology that accelerates deployment, reduces errors, creates exhaustive and searchable system histories, and fundamentally elevates the role of the technician from installer to system co-designer.

---

## **1. Introduction: From Software Vibe-Coding to Physical System Synthesis**

In software engineering, "vibe-coding" has emerged as a powerful collaborative pattern: a developer describes an intent or desired outcome in natural language, and an AI agent synthesizes functional code, iterating based on feedback. This loop dramatically reduces the friction between concept and implementation.

The physical world, particularly in demanding environments like commercial fishing vessels, has remained stubbornly resistant to such acceleration. Installing a bilge pump alarm, a hydraulic pressure monitoring system, or a deck safety network requires a deep, site-specific understanding of spatial constraints, existing wiring, mechanical interdependencies, and the vessel's unique operational "vibe." This knowledge is typically held in the technician's mind and a scattered collection of paper manuals, PDFs, and photos.

**Vibe-Coding Physical Systems (VCPS)** closes this gap. It posits that a technician equipped with a smartphone or augmented reality device and an AI agent can form a synergistic team. The technician possesses unparalleled domain expertise and physical dexterity; the AI possesses limitless computational recall, design synthesis capability, and perfect documentation discipline. VCPS provides the structured protocol for this collaboration, resulting in correctly installed systems and a dynamic, executable knowledge base—the system's digital twin—hosted in a Git repository.

## **2. The VCPS Workflow: An Eight-Stage Collaborative Loop**

The VCPS process is a structured, iterative dialogue between human and AI. Each stage feeds the next, with the Git repository serving as the single source of truth.

### **2.1 Stage 1: Discovery – The Technician’s Walkthrough**
The process begins with the technician on site. Using a VCPS-enabled application, the technician initiates a new project (e.g., `vessel-ss-marie-celeste/engine-monitoring-v1`). The technician provides a high-level objective via voice or text: *"Captain wants to know if the engine room floods while they're asleep, and if the main engine is running too hot."*

The technician then conducts a walkthrough, capturing a series of geotagged and timestamped photographs and videos. These aren't random snaps but structured data captures:
- **Panoramic context shots** of the engine room, fore and aft.
- **Specific component details:** existing bilge pumps, alarm panels, wiring conduits, the main engine, exhaust manifold, coolant lines, and electrical panels.
- **Access challenges:** tight clearances, existing wire runs, potential mounting surfaces.
The AI immediately begins processing these images, building a preliminary spatial and inventory model.

### **2.2 Stage 2: Understanding – AI-Powered Contextual Q&A**
Leveraging multimodal vision-language models (VLMs), the AI analyzes the photographic inventory. It identifies objects (e.g., "Rule 2000 GPH bilge pump," "2-inch discharge hose," "Cole Hersee switch panel") and assesses the scene ("congested area portside aft, clear bulkhead space starboard").

The AI then engages the technician in a clarifying dialogue:
- *"I see two existing bilge pumps. Should the new high-water alarm be independent or integrated with pump switch #2?"*
- *"The photo of the engine shows a blank gauge port on the thermostat housing. Is this available for a temperature sensor?"*
- *"I cannot determine the wire gauge of the existing 12V supply near the pump. Can you take a close-up of the wire markings or measure its diameter?"*
This dialogue resolves ambiguities and tailors the design to the vessel's specific infrastructure and the captain's operational preferences.

### **2.3 Stage 3: Design – Automated System Architecture Generation**
With a validated understanding, the AI generates a complete proposed system design. This is not a generic template but a bespoke architecture. The output includes:
1.  **System Architecture Diagram:** A visual blueprint showing all components, their relationships, and data/power flows.
2.  **Bill of Materials (BOM):** A precise list of parts, with specifications and suggested suppliers (e.g., "3/8" NPT temperature sensor, 0-150°C, 4-20mA output," "Waterproof IP68 float switch, 5A rating," "Raspberry Pi 4 with HAT for 4-20mA inputs," "Marine-grade tinned copper wire, 16 AWG, 50ft").
3.  **Wiring Diagram:** A detailed, vessel-specific schematic showing exact connection points, fuse sizes, and wire colors/routing suggestions.
4.  **Network Topology:** If applicable, a plan for data network (e.g., NMEA 2000 backbone integration, Wi-Fi access point placement).

All design artifacts are committed to the Git repo (`git commit -m "Initial system design based on discovery photos"`).

### **2.4 Stage 4: Vibing – The Iterative Human Refinement Loop**
This is the core of "vibing." The technician reviews the AI's design. Drawing on tacit knowledge and crew feedback, they propose modifications through natural language.
- *"Move the high-water sensor from the center sump to the portside low spot near the stuffing box—that's where water always pools first."*
- *"The captain wants redundant pumps. Can we design a dual-pump setup with a primary and a backup, both on separate circuits?"*
- *"Use the existing conduit run along the starboard hull for the new sensor wires; don't create a new one."*

The AI incorporates this feedback instantly, updating the diagrams, BOM, and providing rationale. Each significant iteration is a new commit, preserving the design history (`git commit -m "Vibe update: relocated primary sensor to port low spot per tech input; added redundant pump circuit"`).

### **2.5 Stage 5: Implementation – The Dynamic Installation Guide**
The AI now synthesizes the final design into a **step-by-step, photo-driven installation guide**. This guide is dynamic and contextual, presented to the technician on a tablet or AR glasses. It includes:
- **Tool List:** Required tools for each step (e.g., "Step 4: 3/8" drill, hole saw, deburring tool").
- **Detailed Instructions:** "Mount the sensor bracket 6 inches above the hull on the portside bulkhead, using the provided stainless steel screws. **Reference Photo:** [Link to discovery photo 12 showing the exact location]."
- **Critical Checkpoints:** "**Before drilling:** Use a stud finder to check for hidden wiring or hydraulic lines behind this bulkhead."
- **AI-Requested Photo Moments:** The guide intelligently prompts for documentation: *"After mounting the sensor, take a photo showing the installed sensor and its cable secured with two zip ties."* This ensures the "as-built" state is captured.

### **2.6 Stage 6: Installation – Execution with Validation**
The technician executes the guide. At each prompted checkpoint, they take a photo. The AI, using vision models, performs real-time validation:
- **Object Verification:** "Confirmed: Temperature sensor correctly installed on exhaust manifold."
- **State Verification:** "Warning: The photo shows the wire pass-through lacks a waterproof gland. Please install gland before proceeding."
- **Progress Tracking:** The AI updates the system's state in its knowledge graph.

This creates a tight feedback loop, catching errors *during* installation, not after.

### **2.7 Stage 7: Testing – Automated System Health Checks**
Once physical installation is complete, the technician initiates the testing phase. The AI generates and runs a diagnostic script.
- It commands the system to read sensors: "Report engine coolant temperature."
- It asks the technician to simulate fault conditions: "Please pour a half-gallon of water into the port bilge. Send a photo of the water level and confirm the high-water alarm sounds."
- It validates sensor readings against expected ranges (e.g., vibration sensor baseline).
All test results—sensor data, photos of gauge readings, audio confirmations of alarms—are committed to the repo.

### **2.8 Stage 8: Documentation – The Living Git-Native Manual**
The final deliverable is not a paper manual. It is the Git repository itself, which now contains:
- The complete photographic history from discovery to final test.
- Every version of the design diagrams and BOM.
- The step-by-step installation guide with embedded validation photos.
- Initial system test results.
- **Issues:** Open tickets for future work (e.g., "Issue #3: Integrate data with vessel's existing chartplotter display").
- **A predictive maintenance schedule:** Based on component specs, the AI generates an initial `MAINTENANCE.md` file.

This repo is the system's living manual, instantly searchable and forkable for similar installations on other vessels.

## **3. Core Technologies and Protocols**

### **3.1 The Photo Protocol**
Visual documentation is the primary data stream. The protocol mandates:
- **Auto-tagging:** All photos are automatically stamped with GPS (or vessel location), timestamp, and a unique step/component ID.
- **Structured Capture:** The AI can request specific photo types: overview, detail, connection, label, gauge-reading.
- **Change Detection:** During maintenance, the AI compares new photos to the `main` branch's baseline to identify modifications or wear.
- **Storage:** High-resolution photos are stored in Git LFS or a linked object store, indexed in a local SQLite database for rapid querying (e.g., "find all photos of the port bilge pump from 2023").

### **3.2 Vision Models for Physical Understanding**
VCPS relies on specialized fine-tuned vision models:
- **Marine-Specific Object Detection:** Identifies pumps, valves, wire types, hydraulic fittings, battery types, and tooling.
- **Scene Graph Generation:** Understands spatial relationships ("the pump is *below* the manifold, *connected to* the discharge hose").
- **State Classification:** Determines if a valve is open/closed, a wire is secured/loose, a seal is intact/degraded.
- **Optical Character Recognition (OCR):** Reads model numbers from nameplates, settings from dials, and values from analog gauges, automatically populating the BOM and test logs.

### **3.3 The Git-Native Paradigm**
Git is repurposed as a project management and documentation engine for the physical world.
- **Commits:** Every discrete action—a design change, an installation step, a test result—is a commit. The history is the audit trail.
- **Branches:** `feature/dual-pump-setup` could be a branch exploring an alternative design before merging into `main`.
- **Tags:** `v1.0-installed`, `v1.1-maintenance-2024-01`.
- **Issues/Pull Requests:** The crew can file an issue: "High-water alarm false positive in heavy seas." The technician can create a PR with a fix, linking photos and test data.

## **4. Concrete Marine Examples**

### **4.1 Example 1: Engine Room Monitoring & Flood Alarm**
*   **Tech Initiation:** "Captain wants alerts for flooding and high exhaust temp during night watches."
*   **AI Discovery Q&A:** After photo review: "The existing pump switch is a simple float. Recommend adding a secondary, higher-level optical sensor for early warning. Confirm space for sensor here?" [Marks spot on photo].
*   **Tech Vibing:** "Add a vibration sensor on the main engine block too. Last time a loose mount caused shaking before overheating."
*   **AI Implementation Guide:** Generates a guide specifying: 1) Drill tap for temperature sensor in manifold, 2) Run wires in existing conduit, 3) Mount vibration sensor with stud adhesive, 4) Connect to AIO board in watertight box, 5) Configure alert thresholds (e.g., Temp >95°C, Vibration >5g RMS).
*   **Validation:** During test, AI instructs: "Run engine at 1500 RPM. Send photo of temp gauge and confirm reading within 5°C of new sensor. Lightly tap engine block with hammer; confirm vibration alert triggers."

### **4.2 Example 2: Deck Safety System for Crane Securement**
*   **Tech Initiation:** "Need a system to alert if the deck crane is left unsecured in transit."
*   **AI Design:** Proposes a small, rugged camera with onboard ML, focused on the crane lockdown pin. Uses few-shot learning.
*   **Tech Vibing:** "Can it also detect if the safety chain is hooked? That's the real protocol."
*   **AI Request:** "Please provide 20 reference photos: 10 of 'secured' (pin in, chain hooked) and 10 of 'unsecured' (any other state)."
*   **Training & Deployment:** The AI fine-tunes a lightweight vision model on the submitted photos, then generates the installation guide for camera mounting, power, and network setup. It also generates the alert logic: "If state='unsecured' for >2 minutes while vessel speed >5 knots, announce on deck speaker: 'Secure the crane.'"
*   **Documentation:** The Git repo contains the trained model weights, the reference photo dataset, and the alert logic code, making it transferable to other cranes on the fleet.

## **5. The Technician as Physical Subagent**

In VCPS, the technician is not replaced but **augmented and elevated**. The AI acts as a remote expert, orchestrator, and scribe. The technician becomes a empowered "subagent" executing high-fidelity physical tasks.
- **Orchestration:** AI: "Locate the primary battery bank and measure the voltage between the main positive terminal and the negative bus bar. Send a photo of the multimeter display."
- **Execution & Reporting:** Technician performs the task, submits the photo.
- **Validation & Continuation:** AI: "Voltage 12.8V confirmed. Proceed to connect the red 10 AWG wire from the distribution block to terminal #3 as shown in Diagram B."

This turns every field technician into a master installer, backed by the collective intelligence of the system's training and the perfect memory of Git.

## **6. Maintenance Mode: The System That Maintains Itself**

Post-installation, the VCPS shifts into **Maintenance Mode**, creating a closed-loop lifecycle.
- **Anomaly Detection:** The system continuously monitors sensor data. Anomalous vibration patterns are flagged and linked to a maintenance issue.
- **Procedural Logs:** When the technician performs an oil change, they follow an AI-generated checklist. Photos of the old filter, new filter, and oil level are taken. The AI commits this with a message: "Maintenance: Main engine oil change. Filter P/N XYZ installed. Oil level 3/4 on dipstick."
- **Predictive Analytics:** The BOM is linked to a component lifetime database. The AI automatically generates issues: "Issue #15: Port bilge pump impeller (Rule 2000, installed 2023-10-26) approaching 2000hrs service life. Schedule replacement."
- **Knowledge Retention:** When a senior technician retires, their institutional knowledge is no longer lost; it is embedded in the commit histories and design rationales of dozens of vessel system repos.

## **7. Conclusion & Future Vectors**

Vibe-Coding Physical Systems represents a paradigm shift for field technical work, particularly in isolated, complex, and mission-critical environments like commercial fishing. It formalizes the collaboration between human intuition and experience and AI's design, validation, and documentation prowess. The outcomes are tangible: faster, more reliable installations, a drastic reduction in design and installation errors, and the creation of a rich, living digital twin for every physical system.

**Future developments** will further deepen this synergy:
- **Augmented Reality (AR) Overlay:** Installation guides and sensor data overlaid directly onto the technician's field of view.
- **Multi-Agent Collaboration:** Fleets of drones or robots acting as additional physical subagents for tasks in hazardous spaces (e.g., fuel tank inspection).
- **Cross-Vessel Learning:** Anonymized data from hundreds of vessel repos training even more robust and predictive AI models for maritime systems.

The age of the paper manual is over. The future of physical systems is Git-committed, AI-validated, and collaboratively vibed into existence.

---
**Appendix A: Sample Git Repository Structure**
```
vessel-ss-marie-celeste-engine-monitoring/
├── README.md                          # Project overview
├── DESIGN/
│   ├── architecture_v1.png            # Initial AI design
│   ├── architecture_v2.png            # Post-vibe design
│   ├── wiring_diagram_final.pdf
│   └── BOM_final.csv
├── DISCOVERY_PHOTOS/                  # Timestamped, geotagged
│   ├── 20231026_0900_engine_bay_panorama.jpg
│   └── 20231026_0905_bilge_pump_detail.jpg
├── INSTALLATION_GUIDE.md              # Dynamic, step-by-step
├── INSTALLATION_PHOTOS/               # AI-validated checkpoint photos
│   └── step_04_sensor_mounted.jpg
├── SOFTWARE/
│   ├── sensor_read.py
│   └── alert_logic.py
├── TEST_RESULTS/
│   └── 20231027_commissioning_log.json
├── MAINTENANCE.md                     # Predictive schedule
└── .git/
```
**Appendix B: Glossary of Terms**
- **VCPS:** Vibe-Coding Physical Systems.
- **Physical Subagent:** The human technician executing AI-orchestrated tasks in the physical world.
- **Photo Protocol:** The standardized method for capturing and tagging visual data.
- **Git-Native Manual:** The use of a Git repository as the primary, living documentation for a physical system.
- **Vibing:** The iterative, natural-language feedback loop between technician and AI to refine a design.