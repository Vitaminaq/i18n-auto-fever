import glob from 'glob';
import jiti from 'jiti';
import path from 'node:path';
import axios from 'axios';
import { outputFile } from 'fs-extra';

const localAxios = axios.create({
  baseURL: "http://127.0.0.1:3002"
});
localAxios.interceptors.response.use((config) => {
  return config.data;
});
const uploadSource = (params) => {
  return localAxios.post("/api/i18n/upload", params);
};

const root = process.cwd();
const translateLanguages = ["en_US", "zh_TW", "zh_HK", "ja_JP"];
const upload = () => {
  return glob(`${root}/!(node_modules)/**/zh-CN.{ts,js,json}`, {}, async (err, files) => {
    if (err)
      throw Error("glob\uFF1A\u67E5\u627E\u6587\u4EF6\u5931\u8D25");
    const pathMap = /* @__PURE__ */ new Map();
    const map = /* @__PURE__ */ new Map();
    const list = [];
    console.log(files, "yyyyyyyyyyyyyyyyyyy");
    if (!files.length)
      return;
    files.forEach(async (filePath) => {
      let content;
      if (filePath.endsWith(".json")) {
        content = (await import(filePath)).default;
      } else {
        const arr = filePath.split("/ZH_CN");
        content = jiti(path.resolve(arr[0]))("./ZH_CN").default;
      }
      list.push(...Object.keys(content).filter(
        (k) => !map.has(content[k]) || map.get(content[k]) !== k
      ).map((key) => {
        map.set(content[key], key);
        return {
          key,
          ZH_CN: content[key]
        };
      }));
      pathMap.set(filePath, content);
    });
    const r = await uploadSource({ list, translate: true });
    if (r.code !== 0)
      return;
    const resultMap = /* @__PURE__ */ new Map();
    r.data.forEach((i) => {
      const { key, ZH_CN } = i;
      resultMap.set(`${key}${ZH_CN}`, i);
    });
    translateLanguages.forEach((lan) => pathMap.forEach((value, key) => {
      if (key.endsWith(".json")) {
        let obj = {};
        Object.keys(value).forEach((i) => {
          const mapKey = `${i}${value[i]}`;
          obj[i] = resultMap.get(mapKey)[lan].value;
        });
        outputFile(path.resolve(key.replace("ZH_CN", lan)), `${JSON.stringify(obj, null, 4)}
`);
      } else {
        let str = "export default {\n";
        Object.keys(value).forEach((i) => {
          const mapKey = `${i}${value[i]}`;
          if (resultMap.has(mapKey)) {
            str = `${str}	${i}: "${resultMap.get(mapKey)[lan].value}",
`;
          } else {
            str = `${str}	${i}: '""',
`;
          }
        });
        outputFile(path.resolve(key.replace("ZH_CN", lan)), `${str}}
`);
      }
    }));
  });
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
