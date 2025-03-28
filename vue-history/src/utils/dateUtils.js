// 格式化时间工具类
import dayjs from 'dayjs';

export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return date ? dayjs(date).format(format) : '--';
};
