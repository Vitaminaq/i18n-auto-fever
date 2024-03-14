import { reactive } from "vue";

interface Store {
    list: API.I18n.List.DataItem[];
    total: number;
    projects: string[];
    token: string;
    fetchParams: API.I18n.List.Params;
}

export const store = reactive<Store>({
    list: [],
    total: 0,
    projects: [],
    token: "",
    fetchParams: {
        page: 0,
        limit: 10,
        sort: -1,
        omit: 0,
    },
});

export const updateLangContent = (item: API.I18n.List.DataItem) => {
    const { list } = store;
    const len = list.length;

    for (let i = 0; i < len; i++) {
        if (list[i]._id === item._id) {
            list[i] = item;
            break;
        }
    }
    return;
}
