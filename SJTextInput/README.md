# SJTextInput - Custom PCF Text Input Control for Power Apps

**SJTextInput** is a fully customizable and modern Power Apps PCF (PowerApps Component Framework) control built with TypeScript. It supports both single-line and multi-line input, rich validations using regex patterns, accessibility features, paste sanitization, dynamic CSS styling, and more.

This control is designed to work seamlessly in **Model-Driven Apps** and **Canvas Apps** and gives developers the flexibility to build dynamic text input fields with advanced behavior using Power Apps.

---

## 🚀 Features

- ✅ Single-line (`<input>`) and multi-line (`<textarea>`) support
- ✅ Input format options (`text`, `password`, `number`, etc.)
- ✅ Live validation using regex `pattern`
- ✅ Max length restriction
- ✅ Spellcheck toggle
- ✅ Custom CSS styling
- ✅ Paste sanitizer (only allows valid characters)
- ✅ Pattern-based character filtering during typing
- ✅ Focus/Blur event handling
- ✅ Disabled & ReadOnly state awareness
- ✅ Responsive design (100% width/height)
- ✅ Compatible with both Model-Driven and Canvas Apps
- ✅ Fully accessible (ARIA attributes)
- ✅ Real-time output binding
- ✅ Works offline

---

## 🧰 Parameters

| Parameter Name | Type     | Description |
|----------------|----------|-------------|
| `value`        | String   | Bound input value |
| `multiline`    | String   | `"true"` to use `<textarea>`, `"false"` for `<input>` |
| `format`       | String   | Input type for `<input>`: `text`, `password`, `number`, etc. |
| `placeholder`  | String   | Placeholder text |
| `spellcheck`   | String   | `"true"` or `"false"` for enabling browser spellcheck |
| `maxLength`    | String   | Maximum allowed characters |
| `pattern`      | String   | Regex pattern to validate input and allow only certain characters |
| `customCSS`    | String   | Additional CSS rules for `.sj-text-input` class |

---

## 🛠 Setup & Development

### Prerequisites

- Node.js (v16+)
- Power Platform CLI (`pac`)
- Microsoft Power Apps CLI extensions
- Visual Studio Code or any code editor
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SJTextInput.git
cd SJTextInput
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Component

```bash
npm run build
```

Or for a watch mode:

```bash
npm run start
```

### 4. Test Locally (Power Apps Test Harness)

```bash
npm start
```

Visit `http://localhost:3000` in your browser to test the control using the PCF test harness.

---

## 🔁 Deployment

### 1. Build Solution

```bash
pac solution init --publisher-name sj --publisher-prefix sj
pac solution add-reference --path ./  # Make sure your control is added
npm run build
pac pcf push --publisher-prefix sj  # For pushing directly to your environment
```

### 2. To Manually Import

1. Package the solution:

```bash
pac solution pack --folder-name ./ --zip-file-name SJTextInput.zip
```

2. Go to [Power Apps Maker Portal](https://make.powerapps.com/)
3. Select **Solutions** > **Import Solution**
4. Upload `SJTextInput.zip`

### 3. To Add Owner Info Properly

Use `pac pcf push` instead of manual import to retain proper publisher/owner metadata.

---

## 🧪 How to Use in Power Apps

1. Add the component to your solution.
2. Go to the form or app where you want to use the control.
3. Add a text field to your entity or data source.
4. Select the field and click on **"Change Control"**
5. Choose `SJTextInput` from the list.
6. Set parameters:

   * `multiline`: `true` or `false`
   * `format`: `text`, `password`, `number`
   * `pattern`: e.g., `^[a-zA-Z0-9]*$` to allow only alphanumeric input
   * `maxLength`: e.g., `100`
   * `customCSS`: Any CSS snippet for `.sj-text-input`

---

## 🎨 Custom CSS Example

```css
border: 2px dashed orange;
background-color: #f8f8f8;
color: #333;
font-family: 'Segoe UI', sans-serif;
```

Paste this in the `customCSS` parameter field to override default styles.

---

## 📂 Project Structure

```
SJTextInput/
├── index.ts                  # Control logic
├── ControlManifest.Input.xml # Manifest for input/output parameters
├── css/                      # Optional CSS files
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🧹 Refresh Input Field

To clear the field manually from another control or event:

```ts
this.refreshData(); // Will reset internal value and notify Power Apps
```

---

## 🧩 Advanced Behavior

* **Input character validation** is done **during typing and paste**
* `pattern` also determines if value is valid — shown by red border
* All invalid characters are automatically filtered out
* Component triggers `notifyOutputChanged()` on every change

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a new branch (`feat/your-feature`)
3. Commit your changes
4. Push and open a PR

---

## 📄 License

MIT License. Free to use and modify.

---

## 🙋 Support

For bugs, issues, or feature requests, please open an [issue](https://github.com/yourusername/SJTextInput/issues) on GitHub.

---

## 🔗 Useful Links

* [PCF Documentation](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/)
* [Power Platform CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

---

Made with ❤️ by [Sameer Jakkali](https://github.com/Sameerjkl)

```

---

Let me know if you'd like a `.zip` solution template, screenshots for the GitHub page, or a `ControlManifest.Input.xml` template as well.
```
