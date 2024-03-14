import path from 'node:path';
import prettier from 'prettier';
import jiti from 'jiti';
import { loadConfig } from 'c12';
import glob from 'glob';
import axios from 'axios';
import { outputFile } from 'fs-extra';

const root = process.cwd();
const projectInfo = jiti(root)("./package.json");
function flattenObject(obj, prefix = "") {
  let result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        let nestedKeys = flattenObject(obj[key], prefix + key + ".");
        result = { ...result, ...nestedKeys };
      } else {
        result[prefix + key] = obj[key];
      }
    }
  }
  return result;
}
const unflattenObject = (obj) => {
  let result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let keys = key.split(".");
      let lastKey = keys.pop();
      let nestedObj = result;
      keys.forEach((nestedKey) => {
        if (!nestedObj.hasOwnProperty(nestedKey) || typeof nestedObj[nestedKey] !== "object") {
          nestedObj[nestedKey] = {};
        }
        nestedObj = nestedObj[nestedKey];
      });
      nestedObj[lastKey] = obj[key];
    }
  }
  return result;
};
const formatCode = (code, parser = "typescript") => {
  return prettier.format(code, { semi: true, tabWidth: 4, parser });
};
const config = {
  reference: "zh-CN",
  langMap: {
    en: "en-US",
    jp: "jp",
    kr: "kr",
    ru: "ru"
  }
};
const loadUserConfig = async () => {
  const { config: useConfig } = await loadConfig({
    name: "fever",
    configFile: "fever.config",
    rcFile: ".feverrc",
    dotenv: true,
    globalRc: true
  });
  console.log(useConfig);
  Object.assign(config, useConfig);
  return config;
};
const defineConfig = (config2) => config2;
const findTargetFile = () => {
  return new Promise((resolve) => {
    glob(
      `{!(node_modules),**}/{*,.*}/${config.reference}{/**.,.}@(ts|js|json)`,
      {},
      async (err, files) => {
        if (err) {
          console.log("glob\uFF1A\u67E5\u627E\u6587\u4EF6\u5931\u8D25");
          return resolve([]);
        }
        resolve(files);
      }
    );
  });
};
const readFileByPath = (filePath) => {
  console.log(filePath, "1111111111");
  const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
  let content;
  try {
    content = jiti(path.resolve(filePath.replace(fileName, "")))(
      `./${fileName}`
    );
  } catch {
    console.error("\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25\uFF1A", filePath);
    return;
  }
  content = content.default || content;
  if (!content)
    return;
  return flattenObject(content);
};

const localAxios = axios.create({
  baseURL: "http://127.0.0.1:3002"
});
localAxios.interceptors.response.use((config) => {
  return config.data;
});
const initAndSync = (data) => {
  return localAxios.post("/api/i18n/init-sync", data);
};
const uploadSource = (params) => {
  return localAxios.post("/api/i18n/upload", params);
};

const upload = () => {
  const { reference, langMap } = config;
  return findTargetFile().then(async (files) => {
    const { name } = projectInfo;
    console.log("\u5F53\u524D\u9879\u76EE", name);
    console.log(files);
    const pathMap = /* @__PURE__ */ new Map();
    const list = [];
    files.forEach(async (filePath) => {
      const content = readFileByPath(filePath);
      if (!content)
        return;
      list.push(
        ...Object.keys(content).map((key) => {
          return {
            key,
            zh_CN: content[key],
            path: filePath
          };
        })
      );
      pathMap.set(filePath, content);
    });
    const r = await uploadSource({ list, project: name });
    if (r.code !== 0)
      return;
    const resultMap = /* @__PURE__ */ new Map();
    r.data.forEach((i) => {
      const { key, project, path: path2 } = i;
      resultMap.set(`${project}.${path2}.${key}`, i);
    });
    Object.keys(langMap).forEach((lan) => {
      pathMap.forEach((value, key) => {
        let obj = {};
        Object.keys(value).forEach((i) => {
          const mapKey = `${name}.${key}.${i}`;
          obj[i] = resultMap.get(mapKey)[lan];
        });
        obj = unflattenObject(obj);
        if (key.endsWith(".json")) {
          outputFile(
            path.resolve(key.replace(reference, langMap[lan])),
            formatCode(`${JSON.stringify(obj, null, 4)}
`, "json")
          );
        } else {
          outputFile(
            path.resolve(key.replace(reference, langMap[lan])),
            formatCode(`export default 
${JSON.stringify(obj, null, 4)}
`)
          );
        }
      });
    });
  });
};

const readAllLang = (files) => {
  const list = [];
  files.forEach((filePath) => {
    const content = readFileByPath(filePath);
    if (!content)
      return;
    const { langMap, reference } = config;
    const map = /* @__PURE__ */ new Map();
    Object.keys(langMap).forEach((i) => {
      map.set(`${i}.${filePath}`, readFileByPath(filePath.replace(reference, langMap[i])));
    });
    list.push(
      ...Object.keys(content).map((key) => {
        const opt = {
          key,
          zh_CN: content[key],
          path: filePath
        };
        Object.keys(langMap).forEach((i) => {
          const item = map.get(`${i}.${filePath}`);
          if (!item)
            return;
          opt[i] = item[key];
        });
        return opt;
      })
    );
  });
  return list;
};
const init = async () => {
  const files = await findTargetFile();
  if (!files.length)
    return;
  const list = readAllLang(files);
  await initAndSync({
    list,
    project: projectInfo.name
  });
};

const run = async () => {
  const action = process.argv.slice(2)[0];
  if (!action)
    return;
  await loadUserConfig();
  switch (action) {
    case "upload":
      await upload();
      break;
    case "init":
      await init();
      break;
  }
};

export { defineConfig, run, upload };
