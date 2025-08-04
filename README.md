# 🔐 Comunicazione Crittografica Sicura

Un'applicazione web per la comunicazione sicura utilizzando crittografia asimmetrica RSA. L'applicazione permette di generare chiavi crittografiche, cifrare e decifrare messaggi in modo completamente sicuro, tutto eseguito localmente nel browser.

## 🌟 Caratteristiche

- **Crittografia RSA**: Utilizza algoritmi di crittografia asimmetrica RSA per comunicazioni sicure
- **Generazione Chiavi**: Crea coppie di chiavi pubbliche e private
- **Esportazione/Importazione**: Salva e carica le tue chiavi crittografiche
- **Interfaccia Intuitiva**: Design moderno e responsive
- **Sicurezza Locale**: Tutti i calcoli crittografici avvengono nel browser
- **Compatibilità**: Funziona su tutti i browser moderni

## 🚀 Come Utilizzare

### 1. Generazione Chiavi

1. Apri l'applicazione nel browser
2. Clicca su "Genera Nuove Chiavi"
3. Le tue chiavi pubbliche e private verranno generate automaticamente
4. **Importante**: Mantieni al sicuro la tua chiave privata!

### 2. Invio Messaggio

1. Inserisci la chiave pubblica del destinatario
2. Scrivi il messaggio da inviare
3. Clicca "Cifra e Prepara per Invio"
4. Copia il messaggio cifrato e invialo al destinatario

### 3. Ricezione Messaggio

1. Incolla il messaggio cifrato ricevuto
2. Clicca "Decifra Messaggio"
3. Il messaggio originale apparirà nel campo decifrato

## 📁 Struttura del Progetto

```
comunicazione-crittografica/
├── index.html          # Pagina principale
├── styles.css          # Stili CSS
├── script.js           # Logica JavaScript
└── README.md           # Documentazione
```

## 🔧 Tecnologie Utilizzate

- **HTML5**: Struttura semantica
- **CSS3**: Stili moderni e responsive
- **JavaScript ES6+**: Logica dell'applicazione
- **JSEncrypt**: Libreria per crittografia RSA
- **CryptoJS**: Libreria per funzioni crittografiche aggiuntive

## 🛡️ Sicurezza

- **Elaborazione Locale**: Tutti i calcoli crittografici avvengono nel browser
- **Nessun Server**: Non vengono inviati dati a server esterni
- **Chiavi Private**: Le chiavi private non lasciano mai il tuo dispositivo
- **Crittografia RSA**: Utilizza algoritmi crittografici standard e sicuri

## 📱 Compatibilità

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Deploy su GitHub Pages

Per deployare l'applicazione su GitHub Pages:

1. Crea un nuovo repository su GitHub
2. Carica tutti i file del progetto
3. Vai su Settings > Pages
4. Seleziona la branch principale
5. L'applicazione sarà disponibile su `https://tuousername.github.io/nome-repository`

## 📋 Funzionalità Avanzate

### Esportazione Chiavi
- Clicca "Esporta Chiavi" per salvare le tue chiavi in formato JSON
- Le chiavi vengono salvate con timestamp per tracciabilità

### Importazione Chiavi
- Clicca "Importa Chiavi" per caricare chiavi esistenti
- Supporta file JSON esportati dall'applicazione

### Copia negli Appunti
- Tutti i campi hanno pulsanti per copiare il contenuto
- Funziona su tutti i browser moderni

## ⚠️ Note Importanti

1. **Chiave Privata**: Non condividere mai la tua chiave privata
2. **Backup**: Fai sempre backup delle tue chiavi
3. **Browser Sicuro**: Utilizza sempre un browser aggiornato
4. **Connessione Sicura**: Assicurati di utilizzare HTTPS quando possibile

## 🐛 Risoluzione Problemi

### Problema: "Errore nella generazione delle chiavi"
- **Soluzione**: Ricarica la pagina e riprova
- **Causa**: Problemi temporanei del browser

### Problema: "Impossibile cifrare il messaggio"
- **Soluzione**: Verifica che la chiave pubblica sia corretta
- **Causa**: Chiave pubblica non valida o corrotta

### Problema: "Impossibile decifrare il messaggio"
- **Soluzione**: Verifica che la chiave privata sia corretta
- **Causa**: Chiave privata non corrispondente o messaggio danneggiato

## 📞 Supporto

Per problemi o domande:
1. Controlla la sezione "Risoluzione Problemi"
2. Verifica la compatibilità del browser
3. Assicurati che JavaScript sia abilitato

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Puoi utilizzarlo liberamente per scopi personali e commerciali.

---

**🔒 Comunicazione Crittografica Sicura** - Mantieni le tue comunicazioni al sicuro!

---

## 👨‍💻 Sviluppatore

**Alesx** - 2025

Sviluppatore di applicazioni web sicure e innovative.

---

## 📄 Licenza

Questo progetto è sviluppato da Alesx. Tutti i diritti riservati. 