const devcert = require('devcert');
const fs = require('fs');
const path = require('path');

async function setup() {
    try {
        console.log('Generando certificados para localhost...');
        const ssl = await devcert.certificateFor('localhost');
        
        const certDir = path.join(__dirname, '.certs');
        if (!fs.existsSync(certDir)) {
            fs.mkdirSync(certDir);
        }

        fs.writeFileSync(path.join(certDir, 'key.pem'), ssl.key);
        fs.writeFileSync(path.join(certDir, 'cert.pem'), ssl.cert);
        
        console.log('Certificados generados exitosamente en .certs/');
    } catch (err) {
        console.error('Error al generar certificados:', err);
    }
}

setup();
