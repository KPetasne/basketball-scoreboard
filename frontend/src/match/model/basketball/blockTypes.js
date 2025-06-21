const blockTypes = [
    'none',
    'regular', // Bloqueo estándar
    'chaseDown', // Bloqueo en una persecución rápida
    'help', // Bloqueo en ayuda defensiva
    'doubleTeam', // Bloqueo realizado en una defensa doble
    'tip', // Bloqueo suave que desvía el balón
    'backboard', // Bloqueo contra el tablero
    'alleyoop', // Bloqueo de un intento de alley-oop
    'jumpShot', // Bloqueo de un tiro en suspensión
    'dunk', // Bloqueo de un intento de clavada
    'layup', // Bloqueo de un intento de bandeja
    'hookShot', // Bloqueo de un gancho
    'closeOut', // Bloqueo cerrando espacio rápidamente al tirador
    'postMove', // Bloqueo en un movimiento en el poste
    'transition', // Bloqueo durante una transición rápida
    'stealBlock', // Bloqueo que también genera un robo
    'pin', // Bloqueo donde el balón queda "pegado" contra el tablero
    'rejection', // Bloqueo agresivo que envía el balón lejos
    'switch', // Bloqueo realizado tras un cambio de marca defensiva
];    

module.exports = blockTypes