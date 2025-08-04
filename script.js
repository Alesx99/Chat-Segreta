// Classe per gestire la crittografia RSA
class CryptoManager {
    constructor() {
        this.encrypt = new JSEncrypt();
        this.decrypt = new JSEncrypt();
        this.currentKeys = {
            publicKey: '',
            privateKey: ''
        };
    }

    // Genera una nuova coppia di chiavi RSA
    generateKeys() {
        try {
            this.encrypt.getKey();
            this.currentKeys.publicKey = this.encrypt.getPublicKey();
            this.currentKeys.privateKey = this.encrypt.getPrivateKey();
            
            // Imposta la chiave privata per la decifratura
            this.decrypt.setPrivateKey(this.currentKeys.privateKey);
            
            return {
                success: true,
                publicKey: this.currentKeys.publicKey,
                privateKey: this.currentKeys.privateKey
            };
        } catch (error) {
            console.error('Errore nella generazione delle chiavi:', error);
            return {
                success: false,
                error: 'Errore nella generazione delle chiavi'
            };
        }
    }

    // Cifra un messaggio con la chiave pubblica del destinatario
    encryptMessage(message, recipientPublicKey) {
        try {
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(recipientPublicKey);
            
            const encrypted = encrypt.encrypt(message);
            if (!encrypted) {
                throw new Error('Impossibile cifrare il messaggio');
            }
            
            return {
                success: true,
                encryptedMessage: encrypted
            };
        } catch (error) {
            console.error('Errore nella cifratura:', error);
            return {
                success: false,
                error: 'Errore nella cifratura del messaggio'
            };
        }
    }

    // Decifra un messaggio con la chiave privata
    decryptMessage(encryptedMessage) {
        try {
            const decrypted = this.decrypt.decrypt(encryptedMessage);
            if (!decrypted) {
                throw new Error('Impossibile decifrare il messaggio');
            }
            
            return {
                success: true,
                decryptedMessage: decrypted
            };
        } catch (error) {
            console.error('Errore nella decifratura:', error);
            return {
                success: false,
                error: 'Errore nella decifratura del messaggio'
            };
        }
    }

    // Imposta chiavi esistenti
    setKeys(publicKey, privateKey) {
        try {
            this.currentKeys.publicKey = publicKey;
            this.currentKeys.privateKey = privateKey;
            this.decrypt.setPrivateKey(privateKey);
            
            return { success: true };
        } catch (error) {
            console.error('Errore nell\'impostazione delle chiavi:', error);
            return {
                success: false,
                error: 'Errore nell\'impostazione delle chiavi'
            };
        }
    }
}

// Classe per gestire l'interfaccia utente
class UI {
    constructor() {
        this.cryptoManager = new CryptoManager();
        this.initializeEventListeners();
    }

    // Inizializza tutti gli event listener
    initializeEventListeners() {
        // Generazione chiavi
        document.getElementById('generateKeys').addEventListener('click', () => this.generateKeys());
        document.getElementById('exportKeys').addEventListener('click', () => this.exportKeys());
        document.getElementById('importKeys').addEventListener('click', () => this.importKeys());
        
        // Copia chiavi
        document.getElementById('copyPublicKey').addEventListener('click', () => this.copyToClipboard('publicKey'));
        document.getElementById('copyPrivateKey').addEventListener('click', () => this.copyToClipboard('privateKey'));
        
        // Messaggi
        document.getElementById('encryptAndSend').addEventListener('click', () => this.encryptMessage());
        document.getElementById('decryptMessage').addEventListener('click', () => this.decryptMessage());
        
        // Copia messaggi
        document.getElementById('copyEncrypted').addEventListener('click', () => this.copyToClipboard('encryptedMessage'));
        document.getElementById('copyDecrypted').addEventListener('click', () => this.copyToClipboard('decryptedMessage'));
    }

    // Genera nuove chiavi
    generateKeys() {
        this.showLoading('generateKeys');
        
        setTimeout(() => {
            const result = this.cryptoManager.generateKeys();
            
            if (result.success) {
                document.getElementById('publicKey').value = result.publicKey;
                document.getElementById('privateKey').value = result.privateKey;
                this.showMessage('Chiavi generate con successo!', 'success');
            } else {
                this.showMessage(result.error, 'error');
            }
            
            this.hideLoading('generateKeys');
        }, 100);
    }

    // Esporta chiavi
    exportKeys() {
        const publicKey = document.getElementById('publicKey').value;
        const privateKey = document.getElementById('privateKey').value;
        
        if (!publicKey || !privateKey) {
            this.showMessage('Genera prima le chiavi!', 'error');
            return;
        }

        const keysData = {
            publicKey: publicKey,
            privateKey: privateKey,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(keysData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chiavi_crittografiche_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('Chiavi esportate con successo!', 'success');
    }

    // Importa chiavi
    importKeys() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const keysData = JSON.parse(e.target.result);
                    
                    if (keysData.publicKey && keysData.privateKey) {
                        const result = this.cryptoManager.setKeys(keysData.publicKey, keysData.privateKey);
                        
                        if (result.success) {
                            document.getElementById('publicKey').value = keysData.publicKey;
                            document.getElementById('privateKey').value = keysData.privateKey;
                            this.showMessage('Chiavi importate con successo!', 'success');
                        } else {
                            this.showMessage(result.error, 'error');
                        }
                    } else {
                        this.showMessage('File non valido!', 'error');
                    }
                } catch (error) {
                    this.showMessage('Errore nella lettura del file!', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Cifra messaggio
    encryptMessage() {
        const recipientPublicKey = document.getElementById('recipientPublicKey').value.trim();
        const message = document.getElementById('messageToSend').value.trim();
        
        if (!recipientPublicKey) {
            this.showMessage('Inserisci la chiave pubblica del destinatario!', 'error');
            return;
        }
        
        if (!message) {
            this.showMessage('Inserisci un messaggio da cifrare!', 'error');
            return;
        }

        this.showLoading('encryptAndSend');
        
        setTimeout(() => {
            const result = this.cryptoManager.encryptMessage(message, recipientPublicKey);
            
            if (result.success) {
                document.getElementById('encryptedMessage').value = result.encryptedMessage;
                this.showMessage('Messaggio cifrato con successo!', 'success');
            } else {
                this.showMessage(result.error, 'error');
            }
            
            this.hideLoading('encryptAndSend');
        }, 100);
    }

    // Decifra messaggio
    decryptMessage() {
        const encryptedMessage = document.getElementById('encryptedMessageReceived').value.trim();
        
        if (!encryptedMessage) {
            this.showMessage('Inserisci un messaggio cifrato da decifrare!', 'error');
            return;
        }

        this.showLoading('decryptMessage');
        
        setTimeout(() => {
            const result = this.cryptoManager.decryptMessage(encryptedMessage);
            
            if (result.success) {
                document.getElementById('decryptedMessage').value = result.decryptedMessage;
                this.showMessage('Messaggio decifrato con successo!', 'success');
            } else {
                this.showMessage(result.error, 'error');
            }
            
            this.hideLoading('decryptMessage');
        }, 100);
    }

    // Copia testo negli appunti
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.value;
        
        if (!text) {
            this.showMessage('Niente da copiare!', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('Copiato negli appunti!', 'success');
        }).catch(() => {
            // Fallback per browser più vecchi
            element.select();
            document.execCommand('copy');
            this.showMessage('Copiato negli appunti!', 'success');
        });
    }

    // Mostra messaggio di successo/errore
    showMessage(message, type) {
        // Rimuovi messaggi esistenti
        const existingMessages = document.querySelectorAll('.message-success, .message-error');
        existingMessages.forEach(msg => msg.remove());

        // Crea nuovo messaggio
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-${type}`;
        messageDiv.textContent = message;
        
        // Inserisci dopo l'header
        const header = document.querySelector('header');
        header.parentNode.insertBefore(messageDiv, header.nextSibling);
        
        // Rimuovi dopo 5 secondi
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }

    // Mostra loading
    showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        const originalText = button.textContent;
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Elaborazione...';
        button.dataset.originalText = originalText;
    }

    // Nasconde loading
    hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        button.disabled = false;
        button.textContent = button.dataset.originalText;
    }
}

// Inizializza l'applicazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    new UI();
    
    // Mostra messaggio di benvenuto
    setTimeout(() => {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'message-success';
        welcomeMessage.innerHTML = `
            <strong>Benvenuto!</strong> 
            Inizia generando le tue chiavi crittografiche per comunicare in modo sicuro.
        `;
        
        const header = document.querySelector('header');
        header.parentNode.insertBefore(welcomeMessage, header.nextSibling);
        
        setTimeout(() => {
            if (welcomeMessage.parentNode) {
                welcomeMessage.parentNode.removeChild(welcomeMessage);
            }
        }, 8000);
    }, 1000);
});

// Funzione per validare le chiavi RSA
function validateRSAKey(key, type) {
    try {
        const encrypt = new JSEncrypt();
        if (type === 'public') {
            encrypt.setPublicKey(key);
        } else {
            encrypt.setPrivateKey(key);
        }
        return true;
    } catch (error) {
        return false;
    }
}

// Funzione per formattare le chiavi per una migliore leggibilità
function formatKey(key) {
    if (!key) return '';
    
    const lines = key.split('\n');
    const formattedLines = lines.map(line => {
        if (line.startsWith('-----')) {
            return line;
        }
        return line.match(/.{1,64}/g)?.join('\n') || line;
    });
    
    return formattedLines.join('\n');
}

/*
 * 🔐 Comunicazione Crittografica Sicura
 * Sviluppato da Alesx - 2024
 * Utilizza crittografia RSA per comunicazioni sicure
 */ 