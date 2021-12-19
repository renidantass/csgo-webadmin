const one_second = 1 * 1000;

const save = (id, response) => {
    localStorage.setItem(id, response);
};

const load = (id) => {
    return localStorage.getItem(id);
};

const putTooltips = () => {
    const elements = document.querySelectorAll('.menu-item');

    for (const element of elements) {
        tippy(`#${element.getAttribute('id')}`, {
            content: element.getAttribute('alt')
        });
    }
};

const updateStatus = (response_received) => {
    const now = new Date().toLocaleTimeString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    const regex_expression = new RegExp(/(?<value>: .*)/g);

    const groups = response_received.match(regex_expression);

    const data = {
        hostname: groups[0],
        ip: groups[2],
        os: groups[3],
        map: groups[5],
        players: groups.length == 8 ? 
        groups[7].split(',')[0].replace('humans', '') : 
        groups[6].split(',')[0].replace('humans', '')
    };

    document.querySelector('#hostname').innerHTML = data.hostname;
    document.querySelector('#map').innerHTML = data.map;
    document.querySelector('#players').innerHTML = data.players;
    document.querySelector('#ip').innerHTML = data.ip;
    document.querySelector('#os').innerHTML = data.os;
    document.querySelector('#last_update').innerHTML = now;
};

const send = (id, command, notNotify) => {
    const console = document.querySelector('#commands');
    const endpoint = "http://127.0.0.1:5000/send-command";
    const data = {
        command
    };
    
    fetch(endpoint,
    {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => { 
        let response = !!data.message ? data.message : `Comando enviado [${id}]\n`;
        console.innerHTML += response;
        console.scrollTop = console.scrollHeight
        save(id, data.message);

        if (!notNotify)
            toastr.success('Comando executado com sucesso!',  response);
    });
};

const macrosAvailable = {
    play() {
        const command = 
        `
        game_mode 1;
        game_type 0;
        exec gamemode_competitive;
        mp_startmoney 800;
        mp_maxmoney 16000;
        mp_give_player_c4 1;
        mp_restartgame 1;
        mp_warmup_end 1;
        bot_kick;
        mp_autoteambalance 0;
        mp_overtime_enable 1;
        mp_autokick 0;
        `;
        return command;
    },
    knife() {
        const command = 
        `
        mp_ct_default_melee weapon_knife;
        mp_t_default_melee weapon_knife;
        mp_t_default_secondary "";
        mp_ct_default_secondary "";
        mp_ct_default_primary "";
        mp_ct_default_primary "";
        mp_roundtime_defuse 6000;
        mp_freezetime 1;
        ammo_grenade_limit_total 0;
        mp_warmuptime 0;
        mp_startmoney 0;
        bot_quota 0;
        mp_buytime 0;
        mp_free_armor 1;
        mp_friendlyfire 0;
        mp_give_player_c4 0;
        mp_maxmoney 0;
        mp_restartgame 1;
        mp_autoteambalance 0;
        `;
        return command;
    },
    swapTeam() {
        const command = `mp_swapteams;`;
        return command;
    },
    restart() {
        const command = `mp_restartgame 1;`;
        return command;
    },
    serverStatus() {
        const command = `status`;
        return command;
    }
};

const refreshServerStatus = () => {
    const macro = macrosAvailable.serverStatus();
    send('serverStatus', macro, true);

    const recoveredStatus = load('serverStatus');
    updateStatus(recoveredStatus);
};

// Update the server status and put tooltips in buttons on page load
window.onload = () => {
    refreshServerStatus();
    putTooltips();
}

// Creating a heartbeat to receive and update status
setInterval(() => {
    refreshServerStatus();
}, 30 * one_second);

// Attach event listener to macros available
document.addEventListener('click', function(event) {
    const id = event.target.getAttribute('id');

    if (!(macrosAvailable[id] instanceof Function))
        return;

    const macro = macrosAvailable[id]();
    send(id, macro);
});

document.querySelector('#command').addEventListener('keypress', function(event) {
    if (event.which !== 13) return;

    const id = 'customCommand';
    const command = document.querySelector('#command').value;
    send(id, command);
});

document.querySelector('#send').addEventListener('click', function() {
    const id = 'customCommand';
    const command = document.querySelector('#command').value;
    send(id, command);
});