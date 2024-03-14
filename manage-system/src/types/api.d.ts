declare namespace API {
    interface BaseResponse<D> {
        code: number;
        data: D
    }

    declare namespace I18n {
        declare namespace List {
            interface DataItem {
                create_time: string;
                en: string;
                jp: string;
                key: string;
                kr: string;
                path: string;
                project: string;
                ru: string;
                update_time: string;
                zh_CN: string;
                _id: string;
            }
        
            interface Params {
                limit: number;
                page: number;
                sort?: number; // 1 升序， 2 降序
                field?: string; // 用于排序的字段 - 暂不支持
                project?: string; // 项目
                filter_zh?: string; // 中文搜索
                omit?: 0 | 1; // 漏翻
            }
        
            type Response = API.BaseResponse<{
                total: number;
                list: DataItem[];
            }>;
        }

        declare namespace Translate.One {
            interface Params {
                text: string;
                to: string;
            }

            interface Data {
                dst: string;
                src: string;
            }

            type Response = API.BaseResponse<Data>;
        }

        declare namespace Update.One {
            interface Params {
                id: string; 
                content: Record<string, string>;
            }

            type Response = API.BaseResponse<API.I18n.List.DataItem>;
        }

        declare namespace Project.Names {
            type Response = API.BaseResponse<string[]>;
        }
        declare namespace Analysis.Participle {
            interface Params {
                text: string;
                num?: number;
            }

            interface DataItem {
                keyword: string;
                weight: number;
            }

            type Response = API.BaseResponse<DataItem[]>;
        }
        declare namespace Similar.Recommend {
            interface Params {
                text: string; 
            }

            type Response = API.BaseResponse<any>;
        }
    }

    declare namespace User {
        declare namespace Login {
            interface Params {
                token: string;
            }

            type Response = API.BaseResponse<string>;
        }
    }
}