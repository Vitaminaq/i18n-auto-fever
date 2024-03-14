import {
  findTargetFile,
  readFileByPath,
  config,
  projectInfo,
} from "./utils";
import { initAndSync } from "./axios";

const readAllLang = (files: string[]) => {
  const list = [];

  files.forEach((filePath) => {
    const content = readFileByPath(filePath);

    if (!content) return;

    const { langMap, reference } = config;

    const map = new Map();

    Object.keys(langMap).forEach(i => {
        map.set(`${i}.${filePath}`, readFileByPath(filePath.replace(reference, langMap[i])));
    });

    list.push(
      ...Object.keys(content).map((key) => {
        const opt = {
            key,
            zh_CN: content[key],
            path: filePath,
        };

        Object.keys(langMap).forEach(i => {
            const item = map.get(`${i}.${filePath}`);

            if (!item) return;
            opt[i] = item[key];
        });

        return opt;
      })
    );
  });
  return list;
};

export const init = async () => {
  const files = await findTargetFile();

  if (!files.length) return;

  const list = readAllLang(files);

  await initAndSync({
    list,
    project: projectInfo.name
  });
};
