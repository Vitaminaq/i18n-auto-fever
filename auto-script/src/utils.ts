import prettier from "prettier";
import jiti from "jiti";
import { loadConfig } from "c12";
import glob from "glob";
import path from "node:path";

export const root = process.cwd();

export const projectInfo = jiti(root)("./package.json");

export function flattenObject(obj: Record<string, any>, prefix = "") {
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

export const unflattenObject = (obj: Record<string, any>) => {
  let result = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let keys = key.split(".");
      let lastKey = keys.pop();
      let nestedObj = result;

      keys.forEach((nestedKey) => {
        if (
          !nestedObj.hasOwnProperty(nestedKey) ||
          typeof nestedObj[nestedKey] !== "object"
        ) {
          nestedObj[nestedKey] = {};
        }
        nestedObj = nestedObj[nestedKey];
      });

      nestedObj[lastKey] = obj[key];
    }
  }

  return result;
};

export const formatCode = (
  code: string,
  parser: "json" | "typescript" = "typescript"
) => {
  return prettier.format(code, { semi: true, tabWidth: 4, parser });
};

export interface Config {
  reference: string;
  langMap: Record<string, string>;
}

export const config: Config = {
  reference: "zh-CN",
  langMap: {
    en: "en-US",
    jp: "jp",
    kr: "kr",
    ru: "ru",
  },
};

export type UserConfig = Partial<Config>;

export const loadUserConfig = async () => {
  const { config: useConfig } = await loadConfig<UserConfig>({
    name: "fever",
    configFile: "fever.config",
    rcFile: ".feverrc",
    dotenv: true,
    globalRc: true,
  });
  console.log(useConfig);

  Object.assign(config, useConfig);

  return config;
};

export const defineConfig = (config: UserConfig) => config;

// 查找翻译文件
export const findTargetFile = (): Promise<any[]> => {
  return new Promise((resolve) => {
    glob(
      `{!(node_modules),**}/{*,.*}/${config.reference}{/**.,.}@(ts|js|json)`,
      {},
      async (err, files) => {
        if (err) {
          console.log("glob：查找文件失败");
          return resolve([]);
        }
        resolve(files);
      }
    );
  });
};

export const readFileByPath = (filePath: string) => {
  const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);

  let content: any;
  try {
    content = jiti(path.resolve(filePath.replace(fileName, "")))(
      `./${fileName}`
    );
  } catch {
    console.error("文件读取失败：", filePath);
    return;
  }

  content = content.default || content;

  if (!content) return;

  return flattenObject(content);
};

export const readLangFile = (filePaths: string[]) => {
  const pathMap = new Map();

  filePaths.forEach(async (filePath: string) => {

    const content = readFileByPath(filePath);

    if (!content) return;

    pathMap.set(filePath, content);
  });

  return pathMap;
};
