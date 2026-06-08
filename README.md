# Bioreactor Demo

A real-time bioreactor visualizer and controller. A WebSocket server keeps a reactor display and a separate controls panel in sync — changes on the controls panel (RPM, viscosity, aeration) are broadcast instantly to the reactor view.

Designed to run on a Raspberry Pi and be accessed from any device on the same network.

---

## Hardware

- Raspberry Pi 4 (or 3B+) running Raspberry Pi OS (64-bit recommended)
- Connected to your local network via Ethernet or Wi-Fi

---

## Raspberry Pi Setup

### 1. Install Node.js

Raspberry Pi OS ships with an outdated version of Node. Install a current LTS release via `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
node -v   # should print v20.x or later
```

### 2. Clone the repo

```bash
git clone https://github.com/AJ5831A/bioreactor-demo.git
cd bioreactor-demo
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

You should see:

```
Server running on http://localhost:3000
Controls:  http://localhost:3000/controls.html
Reactor:   http://localhost:3000/reactor.html
```

---

## Accessing from another device

Find the Pi's IP address:

```bash
hostname -I
```

Then open a browser on any device on the same network:

| Page | URL |
|------|-----|
| Reactor view | `http://<pi-ip>:3000/reactor.html` |
| Controls panel | `http://<pi-ip>:3000/controls.html` |

Open both pages at the same time — changes on the controls panel update the reactor view in real time.

---

## Run on boot (optional)

To start the server automatically when the Pi powers on:

```bash
sudo nano /etc/systemd/system/bioreactor.service
```

Paste the following (replace `pi` with your username if different):

```ini
[Unit]
Description=Bioreactor Demo
After=network.target

[Service]
ExecStart=/home/pi/.nvm/versions/node/v20.19.0/bin/node /home/pi/bioreactor-demo/server.js
WorkingDirectory=/home/pi/bioreactor-demo
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

> Update the `ExecStart` path to match your actual Node binary — check with `which node`.

Enable and start the service:

```bash
sudo systemctl enable bioreactor
sudo systemctl start bioreactor
sudo systemctl status bioreactor
```

---

## Project structure

```
bioreactor-demo/
├── server.js          # Express + WebSocket server
├── package.json
└── public/
    ├── reactor.html   # Reactor visualizer
    └── controls.html  # Controls panel
```
