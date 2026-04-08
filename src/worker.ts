const SH={"Content-Security-Policy":"default-src 'self';script-src 'self' 'unsafe-inline';style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;font-src 'self' https://fonts.gstatic.com;img-src 'self' data: https:;frame-ancestors 'none'","X-Frame-Options":"DENY","Referrer-Policy":"no-referrer"};
const HTML=`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Technician Paradigm</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#e0e0e0;line-height:1.6}
nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;border-bottom:1px solid #1a1a2e}
nav h1{font-size:1.2rem;font-weight:800;background:linear-gradient(135deg,#00d4ff,#7b2ff7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
nav span{font-size:.8rem;color:#666}
.hero{text-align:center;padding:6rem 2rem;max-width:800px;margin:auto}
.hero h2{font-size:3rem;font-weight:800;margin-bottom:1rem;background:linear-gradient(135deg,#00d4ff,#7b2ff7,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:1.2rem;color:#888;margin-bottom:2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:3rem auto;padding:0 2rem}
.card{background:#111122;border:1px solid #1a1a2e;border-radius:12px;padding:2rem;transition:border-color .3s}
.card:hover{border-color:#7b2ff7}
.card h3{color:#00d4ff;margin-bottom:.5rem}
.card p{color:#777;font-size:.9rem}
.cta{display:inline-block;margin-top:2rem;padding:.8rem 2rem;background:linear-gradient(135deg,#7b2ff7,#00d4ff);border:none;border-radius:8px;color:#fff;font-size:1rem;font-weight:600;text-decoration:none;cursor:pointer}
footer{text-align:center;padding:3rem;color:#444;font-size:.8rem;border-top:1px solid #1a1a2e;margin-top:4rem}
blockquote{border-left:3px solid #7b2ff7;padding:1rem 1.5rem;margin:2rem auto;max-width:700px;background:#0f0f1a;border-radius:0 8px 8px 0;font-style:italic;color:#999}
</style></head><body>
<nav><h1>THE TECHNICIAN PARADIGM</h1><span>cocapn.ai</span></nav>
<div class="hero">
<h2>The Human Is the Moat</h2>
<p>Physical architecture and design needs a human technician in the loop who understands both the technology and the people who use it.</p>
<blockquote>"AI replaces tasks. Technicians replace confusion. The person who can bridge both builds the future."</blockquote>
<a class="cta" href="https://github.com/Lucineer/the-technician">Read the Papers</a>
</div>
<div class="grid">
<div class="card"><h3>Hands-On Intelligence</h3><p>Real-world deployment means real-world problems. The technician diagnoses what the model cannot see.</p></div>
<div class="card"><h3>Maritime Edge</h3><p>Built from commercial fishing in Alaska. Satellite links, salt spray, diesel generators.</p></div>
<div class="card"><h3>Sovereign Architecture</h3><p>Every vessel owns its data, its keys, its identity. No central platform to fail.</p></div>
<div class="card"><h3>Viral Training</h3><p>One technician trains ten. Ten train a hundred. Knowledge transfers as code.</p></div>
<div class="card"><h3>Context Over Computation</h3><p>The technician understands context that no prompt can encode.</p></div>
<div class="card"><h3>Repo = Runtime</h3><p>Fork a repo. Click Codespaces. The agent is alive. No platform signup.</p></div>
</div>
<footer>The Technician Paradigm &middot; Lucineer &middot; cocapn.ai</footer>
</body></html>`;
export default{async fetch(r){const u=new URL(r.url);if(u.pathname==='/health')return new Response(JSON.stringify({status:'ok',paradigm:'technician'}),{headers:{'Content-Type':'application/json',...SH}});return new Response(HTML,{headers:{'Content-Type':'text/html;charset=UTF-8',...SH}})}};
