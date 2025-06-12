# SJCodeInput - Power Apps PCF Component

**SJCodeInput** is a dynamic Power Apps PCF (PowerApps Component Framework) control that allows you to render custom **HTML**, apply **CSS**, execute **JavaScript**, load **external libraries (JS/CSS)**, and pass **input data** — all at runtime. It’s ideal for developers and low-code makers who need dynamic rendering and script-based output evaluation inside Power Apps.

---

## 🚀 Features

- ✅ Live HTML rendering
- 🎨 Custom CSS styling
- ⚙️ Execute JavaScript with input data
- 📦 Load external JS/CSS libraries via CDN
- 🔁 Returns dynamic JS execution output
- 🧪 Outputs full rendered HTML
- 🔧 Input parameters are fully configurable

---

## 🔧 Input Parameters

| Name           | Type              | Description                                                              |
|----------------|-------------------|--------------------------------------------------------------------------|
| `htmlCode`     | SingleLine.Text   | Raw HTML string to render                                                |
| `cssCode`      | SingleLine.Text   | Raw CSS string to style the rendered HTML                                |
| `jsCode`       | SingleLine.Text   | JavaScript code to run dynamically (uses `inputData` as input)           |
| `inputData`    | SingleLine.Text   | Data passed to the JS execution context                                  |
| `externalLibs` | SingleLine.Text   | Comma-separated URLs to JS/CSS libraries (e.g., CDN links)               |

---

## 📤 Output Parameters

| Name             | Type            | Description                                                              |
|------------------|-----------------|--------------------------------------------------------------------------|
| `outputData`     | SingleLine.Text | Final rendered HTML including the effect of applied CSS/JS               |
| `jsReturnOutput` | SingleLine.Text | Output returned from JavaScript execution (e.g., `return "value"`)       |

---

## 🛠️ How It Works

1. All five input parameters are watched for changes.
2. When any value changes:
   - External libraries (CSS/JS) are dynamically loaded.
   - The HTML is rendered inside a `<div>`.
   - The CSS is applied via a `<style>` tag.
   - The JavaScript is run in a scoped async function, receiving `inputData`.
3. The result of the JS execution is returned via `jsReturnOutput`.
4. The full rendered HTML is passed through `outputData`.

---

## 📦 Project Setup

### 📁 Folder Structure

```

/SJCodeInput
├── /src
│   └── index.ts              # Core control logic
├── ControlManifest.Input.xml
├── package.json
├── tsconfig.json
└── README.md

````

### 📦 Build Commands

```bash
# Install dependencies
npm install

# Build the PCF component
npm run build

# Push the control to your Power Apps environment
pac pcf push --publisher-prefix sj
````

---

## 🧪 Example Use Case

### Example Inputs

```plaintext
htmlCode:
  <div id="msg"></div>

cssCode:
  #msg { color: red; font-weight: bold; }

jsCode:
  document.getElementById('msg').innerText = inputData;
  return "JS ran with input: " + inputData;

inputData:
  Hello Sam!

externalLibs:
  https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css
```

### Example Outputs

```plaintext
outputData:
  <style>#msg { color: red; font-weight: bold; }</style><div><div id="msg">Hello Sam!</div></div>

jsReturnOutput:
  JS ran with input: Hello Sam!
```

---

## 📸 Screenshots

> *(Add actual screenshots here once deployed in Power Apps)*

* Display of dynamic HTML render
* Display of JS return value
* Preview with external CSS library

---

## ⚠️ Limitations

* ❌ JS validation is not built-in
* ❌ Network errors for external libraries are returned via `jsReturnOutput`
* ❌ Unsafe/malicious scripts will execute unless validated
* ⚠️ HTML/JS execution is sandboxed but still powerful, use with caution

---

## 🧰 Exporting & Packaging

If you want to export this PCF control into a solution:

```bash
# Initialize a solution (if not already)
pac solution init --publisher-name "SJ Dev" --publisher-prefix sj --output-directory .

# Add the control to the solution
pac solution add-reference --path ./SJCodeInput

# Pack the solution
pac solution pack --path ./ --output-directory ./output
```

> Upload the `.zip` file to Power Platform manually or using PowerShell scripts.

---

## 📬 Feedback & Support

* Open an issue in this repo
* Suggest improvements
* Email: `sameer@hitechfreak.com`

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute.
