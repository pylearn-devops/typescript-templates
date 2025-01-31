import React, { useState } from "react";
import { parse as yamlParse, dump as yamlDump } from "js-yaml";
import Ajv from "ajv";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";

const YamlMinifier = () => {
  const [schema, setSchema] = useState("");
  const [yamlInput, setYamlInput] = useState("");
  const [minifiedYaml, setMinifiedYaml] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleMinify = () => {
    try {
      // Parse YAML to JSON
      const json = yamlParse(yamlInput);

      // Validate JSON against Schema
      const ajv = new Ajv();
      const validate = ajv.compile(JSON.parse(schema));
      const valid = validate(json);

      if (!valid) {
        setValidationError(JSON.stringify(validate.errors, null, 2));
        return;
      } else {
        setValidationError("");
      }

      // Minify JSON using aliases
      const aliasMap = {};
      const aliasCount = {};

      const traverse = (obj, path = "") => {
        if (typeof obj === "object" && obj !== null) {
          const key = JSON.stringify(obj);
          aliasCount[key] = (aliasCount[key] || 0) + 1;

          Object.entries(obj).forEach(([k, v]) => {
            traverse(v, `${path}/${k}`);
          });
        }
      };

      // First pass: Count occurrences
      traverse(json);

      // Second pass: Assign aliases to frequently used values
      Object.entries(aliasCount).forEach(([key, count]) => {
        if (count > 1) {
          aliasMap[key] = `&alias${Object.keys(aliasMap).length + 1}`;
        }
      });

      // Third pass: Replace values with aliases
      const replaceWithAlias = (obj) => {
        if (typeof obj === "object" && obj !== null) {
          const key = JSON.stringify(obj);
          if (aliasMap[key]) {
            return { "<<": aliasMap[key] };
          }
          Object.entries(obj).forEach(([k, v]) => {
            obj[k] = replaceWithAlias(v);
          });
        }
        return obj;
      };

      const aliasedJson = replaceWithAlias(json);

      // Generate YAML with aliases
      const yamlOutput = yamlDump(aliasedJson);
      setMinifiedYaml(yamlOutput);
    } catch (err) {
      setValidationError(err.message);
    }
  };

  return (
    <div>
      <h2>JSON Schema</h2>
      <CodeMirror
        value={schema}
        extensions={[yaml()]}
        theme={vscodeLight}
        onChange={(value) => setSchema(value)}
        placeholder="Enter JSON Schema here..."
      />

      <h2>YAML Input</h2>
      <CodeMirror
        value={yamlInput}
        extensions={[yaml()]}
        theme={vscodeLight}
        onChange={(value) => setYamlInput(value)}
        placeholder="Enter YAML here..."
      />

      <button onClick={handleMinify}>Minify YAML</button>

      {validationError && <pre style={{ color: "red" }}>{validationError}</pre>}

      <h2>Minified YAML</h2>
      <CodeMirror
        value={minifiedYaml}
        extensions={[yaml()]}
        theme={vscodeLight}
        readOnly
      />
    </div>
  );
};

export default YamlMinifier;