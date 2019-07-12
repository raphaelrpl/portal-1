# Web Portal - Documentation
Based on master-details model, this application has the following architecture.

## Architecture

![Basic architecture](https://github.com/betonr/portal/blob/dev/docs/BDC%20Arquitecture%20-%20Master_Details.jpg)

## Generate Docs
the documentation of the application is made with the "compodoc" plugin and can be generated as follows

```
cd ../bdc-portal
npm i
npm run docs
```

After that, you can serve these HTML files with command:

```bash
cd documentation
# Python 3
python -m http.server
```

Open web browser http://127.0.0.1:8000