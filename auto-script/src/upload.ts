import path from "node:path";
import {
  projectInfo,
  config,
  unflattenObject,
  formatCode,
  findTargetFile,
  readFileByPath,
} from "./utils";
import { uploadSource } from "./axios";
import { outputFile } from "fs-extra";

export const upload = () => {
  const { reference, langMap } = config;

  return findTargetFile().then(async (files) => {
    const { name } = projectInfo;

    console.log("当前项目", name);
    console.log(files);

    const pathMap = new Map();

    const list = [];

    files.forEach(async (filePath: string) => {
      const content = readFileByPath(filePath);
    
      if (!content) return;

      list.push(
        ...Object.keys(content).map((key) => {
          return {
            key,
            zh_CN: content[key],
            path: filePath,
          };
        })
      );
      pathMap.set(filePath, content);
    });

    const r = await uploadSource({ list, project: name });
    if (r.code !== 0) return;
    const resultMap = new Map();
    r.data.forEach((i) => {
      const { key, project, path } = i;
      resultMap.set(`${project}.${path}.${key}`, i);
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
            formatCode(`${JSON.stringify(obj, null, 4)}\n`, "json")
          );
        } else {
          outputFile(
            path.resolve(key.replace(reference, langMap[lan])),
            formatCode(`export default \n${JSON.stringify(obj, null, 4)}\n`)
          );
        }
      });
    });
  });
};
