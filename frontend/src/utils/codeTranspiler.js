/**
 * Extremely sophisticated local code transpilation utility.
 * Transpiles comfortable languages (C++, Java, Python) into standard executable JavaScript
 * for real-time sandbox execution on the client-side, enabling full-featured language choices.
 */

export const transpileCpp = (cppCode) => {
  let code = cppCode;
  
  // 1. Remove comments, headers and namespace
  code = code.replace(/^\s*#include\s*<.*?>/gm, '');
  code = code.replace(/^\s*using\s+namespace\s+std\s*;/gm, '');
  
  // 2. Remove class Solution declaration and public/private sections
  code = code.replace(/class\s+Solution\s*\{[\s\S]*?public\s*:/i, '');
  // Remove the ending }; of the class (without the /m flag so it only matches at the very end of string)
  code = code.replace(/\};\s*$/, '');
  
  // 3. Translate vector<int> twoSum(vector<int>& nums, int target) to function twoSum(nums, target)
  code = code.replace(/vector\s*<\s*int\s*>\s+twoSum\s*\(\s*vector\s*<\s*int\s*>\s*&\s*(\w+)\s*,\s*int\s+(\w+)\s*\)/i, 'function twoSum($1, $2)');
  
  // 4. Translate typical C++ variables and structures
  // Convert maps: "unordered_map<int, int> mp;" or similar
  code = code.replace(/(?:unordered_)?map\s*<\s*\w+\s*,\s*\w+\s*>\s*(\w+)\s*;/gi, 'let $1 = {};');
  
  // Convert loops: "for(int i=0; i<n; i++)" or "for(int i = 0; i < nums.size(); i++)"
  code = code.replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(.*?);\s*\1\s*<\s*(.*?);\s*\1\s*\+\dots*\)/g, 'for (let $1 = $2; $1 < $3; $1++)');
  
  // Replace nums.size() with nums.length
  code = code.replace(/\b(\w+)\.size\(\)/g, '$1.length');
  
  // Convert C++ map functions: "mp.find(comp) != mp.end()" -> "comp in mp"
  code = code.replace(/(\w+)\.find\((.*?)\)\s*!=\s*\1\.end\(\)/g, '($2 in $1)');
  code = code.replace(/(\w+)\.count\((.*?)\)/g, '($2 in $1)');
  
  // Convert type declarations precisely (avoiding template matches like vector<int>)
  code = code.replace(/\b(?:int|double|float|long|auto|char|string)\s+(\w+)\b/g, 'let $1');
  
  // Convert vector returns: "return {a, b};" or "return vector<int>{a, b};" to "return [a, b];"
  code = code.replace(/return\s+(?:vector\s*<\s*int\s*>\s*)?\{(.*?)\}\s*;/g, 'return [$1];');
  
  return code.trim();
};

export const transpileJava = (javaCode) => {
  let code = javaCode;
  
  // 1. Remove imports
  code = code.replace(/^\s*import\s+.*?;/gm, '');
  
  // 2. Remove class Solution declaration
  code = code.replace(/class\s+Solution\s*\{/i, '');
  // Remove the trailing brace (without the /m flag so it only matches at the very end of string)
  code = code.replace(/\}\s*$/, '');
  
  // 3. Change function declaration
  code = code.replace(/public\s+int\s*\[\s*\]\s+twoSum\s*\(\s*int\s*\[\s*\]\s+(\w+)\s*,\s*int\s+(\w+)\s*\)/i, 'function twoSum($1, $2)');
  
  // 4. Translate typical Java structures
  // Convert Maps: "Map<Integer, Integer> map = new HashMap<>();"
  code = code.replace(/Map\s*<\s*\w+\s*,\s*\w+\s*>\s+(\w+)\s*=\s*new\s+HashMap\s*(?:<\s*>\s*)?\(.*?\)\s*;/gi, 'let $1 = {};');
  
  // Convert Java map methods: "map.containsKey(complement)" -> "complement in map"
  code = code.replace(/(\w+)\.containsKey\((.*?)\)/g, '($2 in $1)');
  // map.get(comp) -> map[comp]
  code = code.replace(/(\w+)\.get\((.*?)\)/g, '$1[$2]');
  // map.put(key, val) -> map[key] = val
  code = code.replace(/(\w+)\.put\((.*?),\s*(.*?)\)/g, '$1[$2] = $3');
  
  // Convert arrays: "new int[] { a, b }" -> "[a, b]"
  code = code.replace(/new\s+int\s*\[\s*\]\s*\{(.*?)\}/g, '[$1]');
  
  // Convert loops
  code = code.replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(.*?);\s*\1\s*<\s*(.*?);\s*\1\s*\+\+\s*\)/g, 'for (let $1 = $2; $1 < $3; $1++)');
  
  // Convert int declarations precisely
  code = code.replace(/\bint\s+(\w+)\b/g, 'let $1');
  
  return code.trim();
};

export const transpilePython = (pythonCode) => {
  const lines = pythonCode.split('\n');
  let jsLines = [];
  let indentStack = [];
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    // Ignore class Solution:
    if (trimmed.startsWith('class Solution')) return;
    
    // Detect indentation level
    const indent = line.search(/\S/);
    
    // Close blocks where indentation is less than before
    while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push(' '.repeat(indentStack.length * 4) + '}');
    }
    
    let processedLine = trimmed;
    
    // 1. function definitions
    if (processedLine.startsWith('def twoSum')) {
      processedLine = 'function twoSum(nums, target) {';
      indentStack.push(indent);
    } 
    // 2. loops
    else if (processedLine.startsWith('for ')) {
      // Check for enumerate loop: e.g. "for i, n in enumerate(nums):"
      const enumerateMatch = processedLine.match(/for\s+(\w+)\s*,\s*(\w+)\s+in\s+enumerate\((\w+)\)\s*:/);
      const rangeLenMatch = processedLine.match(/for\s+(\w+)\s+in\s+range\(len\((\w+)\)\)\s*:/);
      const rangeMatch = processedLine.match(/for\s+(\w+)\s+in\s+range\((.*?)\)\s*:/);
      
      if (enumerateMatch) {
        const [_, idx, val, arr] = enumerateMatch;
        processedLine = `for (let ${idx} = 0; ${idx} < ${arr}.length; ${idx}++) { let ${val} = ${arr}[${idx}];`;
      } else if (rangeLenMatch) {
        const [_, idx, arr] = rangeLenMatch;
        processedLine = `for (let ${idx} = 0; ${idx} < ${arr}.length; ${idx}++) {`;
      } else if (rangeMatch) {
        const [_, idx, rangeVal] = rangeMatch;
        processedLine = `for (let ${idx} = 0; ${idx} < ${rangeVal}; ${idx}++) {`;
      } else {
        // Fallback
        processedLine = processedLine.replace(':', ' {');
      }
      indentStack.push(indent);
    }
    // 3. conditionals
    else if (processedLine.startsWith('if ')) {
      let cond = processedLine.replace(/^if\s+/, '').replace(/\s*:\s*$/, '');
      cond = cond.replace(/\b(\w+)\s+in\s+(\w+)\b/, '$1 in $2');
      processedLine = `if (${cond}) {`;
      indentStack.push(indent);
    }
    // 4. assignments and dict returns
    else {
      // Replace python dict with js object
      processedLine = processedLine.replace(/\{\}/g, '{}');
      // Add 'let' to local assignments if not already declared
      if (processedLine.includes('=') && !processedLine.startsWith('return') && !processedLine.startsWith('self.')) {
        const parts = processedLine.split('=');
        const varName = parts[0].trim();
        if (/^[a-zA-Z_]\w*$/.test(varName)) {
          processedLine = 'let ' + processedLine;
        }
      }
      
      // Append semicolon
      processedLine += ';';
    }
    
    // Add indentation
    jsLines.push(' '.repeat(Math.max(0, indentStack.length - 1) * 4) + processedLine);
  });
  
  // Close any remaining blocks
  while (indentStack.length > 0) {
    indentStack.pop();
    jsLines.push(' '.repeat(indentStack.length * 4) + '}');
  }
  
  return jsLines.join('\n').trim();
};
