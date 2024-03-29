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
      exec("echo "+process.env.SUDO_PW+" | LANG=C sudo -S ufw status", (error, stdout, stderr) => {
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

app.post('/api/v1/deploy', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      const deployInfo = req.body.payload
      const name = deployInfo.name
      exec("rm -f services/"+name+"-deploy.sh", () => {
        fs.writeFile("services/"+name+"-deploy.sh", deployInfo.deploy,() => {
          exec("chmod +x services/"+name+"-deploy.sh", () => {
            exec("bash -c \"cd services && ./"+name+"-deploy.sh\"", (error, stdout, stderr) => {
              fs.writeFile("services/"+name+"/start.sh", deployInfo.command+" "+deployInfo.file,() => {
                exec("chmod +x services/"+name+"/start.sh")
                exec("rm -f services/"+name+"-deploy.sh")
                fs.writeFile("services/template-"+name+".json", JSON.stringify(deployInfo), ()=>{})
              })
            })
          })
        })
      })
    }
  }
})

app.post('/api/v1/start', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      const name = req.body.name
      exec("rm -f logs/"+name+"-run.log && screen -S "+name+" -L -Logfile logs/"+name+"-run.log -d -m bash -c \"cd services && cd "+name+" && ./start.sh\"")
    }
  }
})

app.post('/api/v1/stop', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      const name = req.body.name
      exec("screen -X -S "+name+" kill")
      exec("rm -f logs/"+req.body.name+"-run.log")
    }
  }
})

String.prototype.replaceAll = function(search, replacement) {
  var target = this
  return target.split(search).join(replacement)
}

app.post('/api/v1/getservices', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      exec("ls services/*/ -d | grep \"/\" ", (error, stdout, stderr) => {
        res.send(stdout.replaceAll("services/", "").replaceAll("/", ""))
      })
    }
  }
})

app.post('/api/v1/delservice', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      const name = req.body.name
      exec("rm -rf services/"+name)
      exec("rm -f services/template-"+name+".json")
      exec("rm -f logs/"+name+"-run.log")
    }
  }
})

app.post('/api/v1/servicerunning', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      let isServiceRunning = "no"
      exec("bash -c \"screen -ls | grep "+req.body.name+"\"", (error, stdout, stderr) => {
        if (stdout.includes(req.body.name)) {
          isServiceRunning = "yes" 
        }
        if (fs.existsSync("services/"+req.body.name+"-deploy.sh")) {
          isServiceRunning = "deploying"
        }
        res.send(isServiceRunning)
      })
    }
  }
})

app.post('/api/v1/gettemplate', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      fs.readFile("services/template-"+req.body.name+".json", (err, data) => {
        res.send(data.toString())
      })
    }
  }
})

app.post('/api/v1/log', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      /*fs.readFile("logs/"+req.body.name+"-run.log", (err, data) => {
        if (data) {
          res.send(data.toString())
        }
      })*/
      exec("cat logs/"+req.body.name+"-run.log | perl -pe 's/\x1b\[[0-9;]*[mG]//g'", (error, stdout, stderr) => {
        res.send(stdout);
      })
    }
  }
})

app.post('/api/v1/enter', (req, res) => {
  if (req.body.user_id) {
    let authenticated = false
    process.env.OPS.split(",").forEach(e => {
      if (e === req.body.user_id) {
        authenticated = true
      }
    });
    if (authenticated) {
      exec("bash -c \"screen -S "+req.body.name+" -p 0 -X stuff '"+req.body.command+"^M'\"")
    }
  }
})

app.listen(port, () => {
  console.log(`Kimchi backend listening at http://localhost:${port}`)
})