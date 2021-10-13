const express = require('express')
const os 	= require('os-utils');
const bodyParser = require('body-parser')
const osu = require('node-os-utils')
const osn = require('os');
const checkDiskSpace = require('check-disk-space').default
const { exec } = require("child_process");
const fs = require('fs')
const app = express()
const port = 2041

require('dotenv').config();

var cors = require('cors')
app.use(bodyParser.json())

app.use(cors())

app.post('/api/v1/get/authenticated', (req, res) => {
  if (req.body.user_id) {
    let authenticated = "false"
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = "true"
      }
    });
    res.send(authenticated)
  }
})

app.post('/api/v1/get/ram', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      const ram = parseInt((os.totalmem() - os.freemem()) / os.freemem() * 10);
      res.send(String(ram));
    }
  }
})

app.post('/api/v1/get/cpu', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      var cpu = osu.cpu
      cpu.usage().then(info => {
        res.send(String(info));
      })
    }
  }
})

app.post('/api/v1/get/disk', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      checkDiskSpace('/').then((diskSpace) => {
        const diskSpacePercentage = diskSpace.free / diskSpace.size * 10
        res.send(String(diskSpacePercentage))
      })
    }
  }
})

app.post('/api/v1/get/la', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      res.send(osn.loadavg()[0].toFixed(2).toString())
    }
  }
})

app.post('/api/v1/ufw/status', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      exec("echo "+process.env.SUDO_PW+" | sudo -S ufw status", (error, stdout, stderr) => {
        res.send(stdout)
      })
    }
  }
})

app.post('/api/v1/ufw/enable', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      exec("echo "+process.env.SUDO_PW+" | sudo -S ufw enable", (error, stdout, stderr) => {
        res.send(stdout)
      })
    }
  }
})

app.post('/api/v1/ufw/disable', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      exec("echo "+process.env.SUDO_PW+" | sudo -S ufw disable", (error, stdout, stderr) => {
        res.send(stdout)
      })
    }
  }
})

app.post('/api/v1/ufw/add', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      exec("echo "+process.env.SUDO_PW+" | sudo -S ufw allow "+req.body.port, (error, stdout, stderr) => {
        res.send(stdout)
      })
    }
  }
})

app.post('/api/v1/ufw/del', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      exec("echo "+process.env.SUDO_PW+" | sudo -S ufw delete allow "+req.body.port, (error, stdout, stderr) => {
        res.send(stdout)
      })
    }
  }
})

app.post('/api/v1/get/motd', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      fs.readFile('./motd.txt', 'utf8' , (err, data) => {
        res.send(data.toString())
      })
    }
  }
})

app.listen(port, () => {
  console.log(`Kimchi backend listening at http://localhost:${port}`)
})