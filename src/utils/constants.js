const constants = {
  PAGE_SIZE: 15, // 分页拉取数据量
  AUTH_TOKEN: 'AUTH_TOKEN', // 认证token key
  AUTH_AUTO_LOGIN: 'AUTH_AUTO_LOGIN',
  SYSTEM_PATH: 'SYSTEM_PATH',
  DEFAULT_SYS_NAME: 'LangoAI', // 默认系统名称
  PSW_REG: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./])[\da-zA-Z~!@#$%^&*()_+`\-={}:";'<>?,./]{8,36}$/,
};
module.exports = constants;
