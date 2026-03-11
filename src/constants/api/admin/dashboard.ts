import { getRequest } from "@/lib/api-request";

export const topContentAction = () => getRequest('/admin/dashboards/top-content'); //for hero congratulation text
export const statsAction = () => getRequest('/admin/dashboards/stats'); //for replace Transactions 2 stats
export const summaryAction = () => getRequest('/admin/dashboards/summary'); //for replace Total Earning and its side cards
export const chartAction = () => getRequest('/admin/dashboards/charts'); //for replace Weekly Overview and performance charts
export const topCategoryAction = () => getRequest('/admin/dashboards/top-categories'); //for replace Sales by Countries
export const topActivityAction = () => getRequest('/admin/dashboards/activity'); //for replace Deposits and WithDraws
export const dashBoardUserListAction = (params:any) => getRequest('/admin/dashboards/users',params); //for replace user tables