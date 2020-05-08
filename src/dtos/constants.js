export const FieldDataRules = {
  "required": [{ required: true, message: "必填", "trigger": "blur" }],
  "int": [{ type: "string", pattern: /^-?\d+$/, message: "必须为整形数值", "trigger": "blur" }],
  "integer": [{ pattern: /^-?\d+?$/, message: "必须为整形数值" }],
  "double": [{ type: "string", pattern: /^-?\d+\.?\d*?$/, message: "必须为浮点型数值" }],
  "float": [{ type: "string", pattern: /^-?\d+\.?\d*?$/, message: "必须为浮点型数值" }],
  "string": []
}
export const FieldDataControl = {
  "int": 'number',
  "integer": 'number',
  "double": 'number',
  "float": 'number',
  "string": 'text'
}