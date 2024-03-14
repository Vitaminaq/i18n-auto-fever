declare const upload: () => Promise<void>;

interface Config {
    reference: string;
    langMap: Record<string, string>;
}
type UserConfig = Partial<Config>;
declare const defineConfig: (config: UserConfig) => Partial<Config>;

declare const run: () => Promise<void>;

export { type UserConfig, defineConfig, run, upload };
