# the-technician

> The Technician Paradigm — white papers and architecture for an AI ecosystem where physical installations meet git-native agent intelligence.

## The Thesis

Physical architecture and design needs a human technician in the loop who understands both the technology and the human domain. The AI doesn't replace the technician — it makes the technician superhuman.

A technician walks onto a boat with a Jetson in a Pelican case. They plug it in. They open Telegram and start chatting. The Jetson asks about the boat, the captain's needs. The tech walks around taking photos. The AI builds a git-agent fleet — one repo for each system. Within hours, the boat has an intelligent monitoring system with a complete, versioned knowledge base.

## Papers

| # | Paper | Description |
|---|-------|-------------|
| 0 | [Manifesto](00-MANIFESTO.md) | The founding document — why technicians are the future of AI |
| 1 | [Field Kit Architecture](01-FIELD-KIT-ARCHITECTURE.md) | Jetson hardware/software spec, boot sequence, connectivity |
| 2 | [Vibe-Coding Physical Systems](02-VIBE-CODING-PHYSICAL.md) | How tech + AI collaborate on physical installations |
| 3 | [Ship Intelligence Architecture](03-SHIP-INTELLIGENCE.md) | Monitoring, alerting, knowledge graphs for vessels |
| 4 | [The Training Port](04-TRAINING-PORT.md) | Building a viral technician network from a fishing port |
| 5 | [Cocapn as Foundation](05-COCAPN-FOUNDATION.md) | How the agent runtime powers everything |

## The Stack

```
Jetson Super Orin Nano 8GB + 2TB NVMe
├── Local LLMs (Phi-3-mini, Whisper, Piper TTS)
├── Git-agent fleet (one repo per physical system)
├── Telegram/Discord bot (technician interface)
├── Web interface (captain.local:8080)
├── Vision models (gauge reading, flooding, thermal)
├── Sensor network (water, temp, vibration, electrical)
├── Camera system (engine room + deck)
└── Cloudflare Tunnel → Cocapn cloud services
```

## The Moat

1. **Trust network** — technicians trust other technicians, not tech companies
2. **Accumulated knowledge** — every git commit makes the fleet smarter
3. **Physical domain expertise** — earned through real installations
4. **Training infrastructure** — port-as-academy, technician-teaches-technician
5. **Captain relationships** — captains trust their technicians

## The Training Ground

A commercial fishing port in Alaska. Real boats, real problems, real captains. The first technician (Casey) proves the paradigm. Others learn by watching, then doing. The network grows virally through maritime communities.

## The 12-Month Vision

- **Month 1-3**: 5-10 boats in home port
- **Month 4-6**: 2-3 trained technicians, 15-25 boats
- **Month 7-9**: Adjacent ports, 50+ boats
- **Month 10-12**: Multiple ports, 100+ boats, formal training program

This isn't about selling hardware. It's about building the technician network that becomes the backbone of physical AI for every industry. Fishing → maritime → oil & gas → agriculture → manufacturing → construction.

---

<i>Built by [Superinstance](https://github.com/superinstance) & [Lucineer](https://github.com/Lucineer) (DiGennaro et al.)</i>

<i>Powered by [Cocapn](https://github.com/Lucineer/cocapn-ai) — The sovereign agent runtime</i>
