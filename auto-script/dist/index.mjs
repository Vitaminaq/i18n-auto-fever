import glob from 'glob';
import jiti from 'jiti';
import path from 'node:path';
import prettier from 'prettier';
import axios from 'axios';
import { outputFile } from 'fs-extra';

const flattenObject = (obj) => {
  const format = {};
  const flat = (target, key = "") => {
    Object.keys(target).forEach((k) => {
      key = `${key}${key && "."}${k}`;
      if (typeof target[k] !== "object" || !target[k]) {
        format[key] = target[k];
        key = "";
        return;
      }
      flat(target[k], key);
    });
  };
  flat(obj);
  return format;
};
const flattenToObject = (obj) => {
  const format = {};
  let current = format;
  Object.keys(obj).forEach((k) => {
    const keys = k.split(".");
    const len = keys.length;
    if (len < 2) {
      current[k] = obj[k];
      return;
    }
    let i = 0;
    while (i < len) {
      current = current[keys[i]] = i === len - 1 ? obj[k] : {};
      i++;
    }
  });
  return format;
};
const formatCode = (code, parser = "typescript") => {
  return prettier.format(code, { semi: true, tabWidth: 4, parser });
};

const localAxios = axios.create({
  baseURL: "http://127.0.0.1:3002"
});
localAxios.interceptors.response.use((config) => {
  return config.data;
});
const uploadSource = (params) => {
  return localAxios.post("/api/i18n/upload", params);
};

const translateLanguages = ["en_US", "zh_TW", "zh_HK", "ja_JP"];
const lanMap = {
  en_US: "en-US",
  zh_TW: "zh-TW",
  zh_HK: "zh-HK",
  ja_JP: "ja-JP"
};
const upload = () => {
  return glob(
    "{!(node_modules),**}/zh-CN{/**.,.}@(ts|js|json)",
    {},
    async (err, files) => {
      if (err)
        throw Error("glob\uFF1A\u67E5\u627E\u6587\u4EF6\u5931\u8D25");
      console.log(files, "ppppp");
      const pathMap = /* @__PURE__ */ new Map();
      const map = /* @__PURE__ */ new Map();
      const list = [];
      files.forEach(async (filePath) => {
        const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        let content = jiti(path.resolve(filePath.replace(fileName, "")))(
          `./${fileName}`
        );
        if (!content)
          return;
        content = content.default || content;
        content = flattenObject(content);
        list.push(
          ...Object.keys(content).filter((k) => !map.has(content[k]) || map.get(content[k]) !== k).map((key) => {
            map.set(content[key], key);
            return {
              key,
              zh_CN: content[key]
            };
          })
        );
        pathMap.set(filePath, content);
      });
      const r = await uploadSource({ list, translate: true });
      if (r.code !== 0)
        return;
      const resultMap = /* @__PURE__ */ new Map();
      r.data.forEach((i) => {
        const { key, zh_CN } = i;
        resultMap.set(`${key}${zh_CN}`, i);
      });
      translateLanguages.forEach(
        (lan) => pathMap.forEach((value, key) => {
          let obj = {};
          Object.keys(value).forEach((i) => {
            const mapKey = `${i}${value[i]}`;
            obj[i] = resultMap.get(mapKey)[lan].value;
          });
          obj = flattenToObject(obj);
          if (key.endsWith(".json")) {
            outputFile(
              path.resolve(key.replace("zh-CN", lanMap[lan])),
              formatCode(`${JSON.stringify(obj, null, 4)}
`, "json")
            );
          } else {
            outputFile(
              path.resolve(key.replace("zh-CN", lanMap[lan])),
              formatCode(`export default 
${JSON.stringify(obj, null, 4)}
`)
            );
          }
        })
      );
    }
  );
};

const run = async () => {
  const action = process.argv.slice(2)[0];
  if (!action)
    return;
  switch (action) {
    case "upload":
      await upload();
      break;
  }
};

export { run, upload };
