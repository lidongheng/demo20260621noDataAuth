const userAuthMock = {
  account: "12345678",
  ruleCodeList: [
    {
      name: "张三",
      code: "ROLE_CXO",
    },
    {
      name: "张三",
      code: "ROLE_SALES",
    },
    {
      name: "张三",
      code: "ROLE_CUSTOMER",
    },
  ],
  regionCodeList: [
    {
      name: "华东",
      code: "REGION_CN_EAST",
      children: [
        {
          name: "英超-阿森纳",
          code: "REGION_CN_EAST",
        },
        {
          name: "英超-切尔西",
          code: "REGION_CN_EAST_CHELSEA",
        },
        {
          name: "英超-利物浦",
          code: "REGION_CN_EAST_LIVERPOOL",
        },
      ],
    },
    {
      name: "华西",
      code: "REGION_CN_WEST",
      children: [
        {
          name: "西甲-皇家马德里",
          code: "REGION_CN_WEST_REAL_MADRID",
        },
        {
          name: "西甲-巴塞罗那",
          code: "REGION_CN_WEST_BARCELONA",
        },
        {
          name: "西甲-马德里竞技",
          code: "REGION_CN_WEST_ATLETICO",
        },
      ],
    },
    {
      name: "华南",
      code: "REGION_CN_SOUTH",
      children: [
        {
          name: "意甲-国际米兰",
          code: "REGION_CN_SOUTH_INTER",
        },
        {
          name: "德甲-拜仁慕尼黑",
          code: "REGION_CN_SOUTH_BAYERN",
        },
        {
          name: "法甲-巴黎圣日耳曼",
          code: "REGION_CN_SOUTH_PSG",
        },
      ],
    },
  ],
  dataTypeList: [
    {
      name: "张三",
      code: "DATA_COST",
    },
    {
      name: "张三",
      code: "DATA_EFFICIENCY",
    },
    {
      name: "张三",
      code: "DATA_REVENUE",
    },
  ],
};

const statusTextMap = {
  waiting: "未拥有",
  owned: "已拥有",
  approving: "审批中",
};

let applications = [
  {
    user: "12345678",
    order: "ORDER1001",
    title: "数据权限申请",
    status: "审批中",
    approver: "张三",
    userId: "12345678",
    tenant: "",
    description: "项目联调需要临时开通数据权限。",
    dataRoleList: [
      {
        dataRoleId: "ROLE_CXO",
        validityPeriod: "2027-10-31",
      },
      {
        dataRoleId: "REGION_CN_EAST",
        validityPeriod: "2027-10-31",
      },
      {
        dataRoleId: "DATA_COST",
        validityPeriod: "2027-10-31",
      },
    ],
  },
];

let recordSeed = 1002;

const waitMock = (data) =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        status: 0,
        message: "",
        messageEn: "",
        data,
      });
    }, 220);
  });

const clone = (value) => JSON.parse(JSON.stringify(value));

const toOrderView = (record) => ({
  user: record.user,
  order: record.order,
  title: record.title,
  status: record.status,
  approver: record.approver,
});

export const getNoDataAuthOptions = () =>
  waitMock(clone(userAuthMock));

export const getNoDataAuthList = (params) => {
  let list = applications;

  if (params.status !== "all") {
    list = list.filter((record) => record.status === statusTextMap[params.status]);
  }

  return waitMock(clone(list.map(toOrderView)));
};

export const createNoDataAuth = (payload) => {
  const record = {
    user: payload.userId,
    order: `ORDER${recordSeed}`,
    title: "数据权限申请",
    status: "审批中",
    approver: "张三",
    userId: payload.userId,
    tenant: payload.tenant,
    description: payload.description,
    dataRoleList: payload.dataRoleList,
  };

  recordSeed += 1;
  applications = [record, ...applications];

  return waitMock(true);
};

export const updateNoDataAuth = (order, payload) => {
  applications = applications.map((record) => {
    if (record.order !== order) {
      return record;
    }

    return {
      ...record,
      userId: payload.userId,
      tenant: payload.tenant,
      description: payload.description,
      dataRoleList: payload.dataRoleList,
    };
  });

  return waitMock(true);
};

export const deleteNoDataAuth = (order) => {
  applications = applications.filter((record) => record.order !== order);

  return waitMock(true);
};
