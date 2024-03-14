export const langTextMap: any = {
    zh_CN: '中文',
    en: '英语',
    jp: '日语',
    kr: '韩语',
    ru: '俄语'
}

export const langTranslateMap: any = {
	zh_CN: 'zh',
    en: 'en',
    jp: 'jp',
    kr: 'kor',
    ru: 'ru'
}

export function formatDate(fmt: string, timeStamp: string | number | Date) {
	//timeStamp是以秒为单位的
	const date = timeStamp ? new Date(timeStamp) : new Date();
	const o = {
		"M+": date.getMonth() + 1, //月份
		"D+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		S: date.getMilliseconds(), //毫秒
	};
	if (/(Y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	for (const k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1
					? (o as any)[k]
					: ("00" + (o as any)[k]).substr(("" + (o as any)[k]).length)
			);
	return fmt;
}
