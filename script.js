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

    initializeEventListeners() {
        // Gestione chiavi
        document.getElementById('generateKeys').addEventListener('click', () => this.generateKeys());
        document.getElementById('exportKeys').addEventListener('click', () => this.exportKeys());
        document.getElementById('importKeys').addEventListener('click', () => this.importKeys());
        document.getElementById('setManualKeys').addEventListener('click', () => this.setManualKeys());
        
        // Copia chiavi
        document.getElementById('copyPublicKey').addEventListener('click', () => this.copyToClipboard('publicKey'));
        document.getElementById('copyPrivateKey').addEventListener('click', () => this.copyToClipboard('privateKey'));
        
        // Messaggi
        document.getElementById('encryptAndSend').addEventListener('click', () => this.encryptMessage());
        document.getElementById('decryptMessage').addEventListener('click', () => this.decryptMessage());
        
        // Copia messaggi
        document.getElementById('copyEncrypted').addEventListener('click', () => this.copyToClipboard('encryptedMessage'));
        document.getElementById('copyDecrypted').addEventListener('click', () => this.copyToClipboard('decryptedMessage'));
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }

    // Genera nuove chiavi
    generateKeys() {
        this.showLoading('generateKeys');
        
        setTimeout(() => {
            const result = this.cryptoManager.generateKeys();
            
            if (result.success) {
                document.getElementById('publicKey').value = result.publicKey;
                document.getElementById('privateKey').value = result.privateKey;
                document.getElementById('keysDisplay').style.display = 'grid';
                this.showMessage('✅ Chiavi generate con successo!', 'success');
            } else {
                this.showMessage('❌ ' + result.error, 'error');
            }
            
            this.hideLoading('generateKeys');
        }, 500);
    }

    // Imposta chiavi manualmente
    setManualKeys() {
        const publicKey = document.getElementById('manualPublicKey').value.trim();
        const privateKey = document.getElementById('manualPrivateKey').value.trim();
        
        if (!publicKey || !privateKey) {
            this.showMessage('❌ Inserisci sia la chiave pubblica che quella privata', 'error');
            return;
        }
        
        if (!validateRSAKey(publicKey, 'public') || !validateRSAKey(privateKey, 'private')) {
            this.showMessage('❌ Chiavi RSA non valide', 'error');
            return;
        }
        
        const result = this.cryptoManager.setKeys(publicKey, privateKey);
        
        if (result.success) {
            document.getElementById('publicKey').value = publicKey;
            document.getElementById('privateKey').value = privateKey;
            document.getElementById('keysDisplay').style.display = 'grid';
            this.showMessage('✅ Chiavi impostate correttamente!', 'success');
        } else {
            this.showMessage('❌ ' + result.error, 'error');
        }
    }

    // Esporta chiavi
    exportKeys() {
        if (!this.cryptoManager.currentKeys.publicKey || !this.cryptoManager.currentKeys.privateKey) {
            this.showMessage('❌ Genera o carica le chiavi prima di esportarle', 'error');
            return;
        }
        
        const keysData = {
            publicKey: this.cryptoManager.currentKeys.publicKey,
            privateKey: this.cryptoManager.currentKeys.privateKey,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(keysData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chiavi_rsa_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage('✅ Chiavi esportate con successo!', 'success');
    }

    // Importa chiavi
    importKeys() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const keysData = JSON.parse(event.target.result);
                    
                    if (!keysData.publicKey || !keysData.privateKey) {
                        this.showMessage('❌ File non valido: chiavi mancanti', 'error');
                        return;
                    }
                    
                    if (!validateRSAKey(keysData.publicKey, 'public') || !validateRSAKey(keysData.privateKey, 'private')) {
                        this.showMessage('❌ Chiavi RSA non valide nel file', 'error');
                        return;
                    }
                    
                    const result = this.cryptoManager.setKeys(keysData.publicKey, keysData.privateKey);
                    
                    if (result.success) {
                        document.getElementById('publicKey').value = keysData.publicKey;
                        document.getElementById('privateKey').value = keysData.privateKey;
                        document.getElementById('keysDisplay').style.display = 'grid';
                        this.showMessage('✅ Chiavi importate con successo!', 'success');
                    } else {
                        this.showMessage('❌ ' + result.error, 'error');
                    }
                } catch (error) {
                    this.showMessage('❌ Errore nella lettura del file', 'error');
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
            this.showMessage('❌ Inserisci la chiave pubblica del destinatario', 'error');
            return;
        }
        
        if (!message) {
            this.showMessage('❌ Inserisci un messaggio da cifrare', 'error');
            return;
        }
        
        if (!validateRSAKey(recipientPublicKey, 'public')) {
            this.showMessage('❌ Chiave pubblica non valida', 'error');
            return;
        }
        
        this.showLoading('encryptAndSend');
        
        setTimeout(() => {
            const result = this.cryptoManager.encryptMessage(message, recipientPublicKey);
            
            if (result.success) {
                document.getElementById('encryptedMessage').value = result.encryptedMessage;
                document.getElementById('encryptedResult').style.display = 'block';
                this.showMessage('✅ Messaggio cifrato con successo!', 'success');
            } else {
                this.showMessage('❌ ' + result.error, 'error');
            }
            
            this.hideLoading('encryptAndSend');
        }, 300);
    }

    // Decifra messaggio
    decryptMessage() {
        const encryptedMessage = document.getElementById('encryptedMessageReceived').value.trim();
        
        if (!encryptedMessage) {
            this.showMessage('❌ Inserisci un messaggio cifrato', 'error');
            return;
        }
        
        if (!this.cryptoManager.currentKeys.privateKey) {
            this.showMessage('❌ Carica le tue chiavi prima di decifrare', 'error');
            return;
        }
        
        this.showLoading('decryptMessage');
        
        setTimeout(() => {
            const result = this.cryptoManager.decryptMessage(encryptedMessage);
            
            if (result.success) {
                document.getElementById('decryptedMessage').value = result.decryptedMessage;
                document.getElementById('decryptedResult').style.display = 'block';
                this.showMessage('✅ Messaggio decifrato con successo!', 'success');
            } else {
                this.showMessage('❌ ' + result.error, 'error');
            }
            
            this.hideLoading('decryptMessage');
        }, 300);
    }

    // Cambia tab
    switchTab(tabName) {
        // Rimuovi classe active da tutti i tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Aggiungi classe active al tab selezionato
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // Copia negli appunti
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        element.select();
        element.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            this.showMessage('✅ Copiato negli appunti!', 'success');
        } catch (err) {
            this.showMessage('❌ Errore nella copia', 'error');
        }
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
 * Sviluppato da Alesx - 2025
 * Utilizza crittografia RSA per comunicazioni sicure
 */ 