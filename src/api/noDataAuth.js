const userAuthMock = {
  account: "12345678",
  totalDimenPermConfigList: [
    {
      permDimenTypeCode: "1",
      permDimenTypeName: "角色",
      detailList: [
        {
          permCode: "ROLE_CXO",
          permName: "CXO",
        },
        {
          permCode: "ROLE_INTERNAL_CUSTOMER",
          permName: "内部客户",
        },
      ],
    },
    {
      permDimenTypeCode: "2",
      permDimenTypeName: "区域",
      detailList: [
        {
          permCode: "AREA_CN_SOUTH",
          permName: "华南",
        },
        {
          permCode: "AREA_CN_EAST",
          permName: "华东",
        },
      ],
    },
    {
      permDimenTypeCode: "4",
      permDimenTypeName: "云服务类型",
      detailList: [
        {
          permCode: "CLOUD_ECS",
          permName: "ECS",
        },
        {
          permCode: "CLOUD_OBS",
          permName: "OBS",
        },
        {
          permCode: "CLOUD_XPU",
          permName: "XPU",
        },
      ],
    },
    {
      permDimenTypeCode: "5",
      permDimenTypeName: "Region",
      detailList: [
        {
          permCode: "REGION_CN_EAST",
          permName: "东北-长春-一汽",
        },
        {
          permCode: "REGION_CN_NORTH",
          permName: "东北-沈阳一",
        },
        {
          permCode: "REGION_CN_SOUTH",
          permName: "华北-北京一",
        },
        {
          permCode: "REGION_CN_WEST",
          permName: "华北-北京二",
        },
        {
          permCode: "REGION_CN_BEIJING_ONE",
          permName: "华东-上海一",
        },
        {
          permCode: "REGION_CN_SHANGHAI_ONE",
          permName: "华东-上海二",
        },
        {
          permCode: "REGION_CN_SHENZHEN",
          permName: "华南-广州一",
        },
        {
          permCode: "REGION_CN_HONGKONG",
          permName: "西南-贵阳一",
        },
        {
          permCode: "REGION_AP_SINGAPORE",
          permName: "亚太-新加坡",
        },
        {
          permCode: "REGION_AP_JAKARTA",
          permName: "亚太-雅加达",
        },
        {
          permCode: "REGION_EU_FRANKFURT",
          permName: "欧洲-法兰克福",
        },
        {
          permCode: "REGION_US_SILICON_VALLEY",
          permName: "北美-硅谷",
        },
      ],
    },
  ],
  ruleCodeList: [
    {
      name: "张三",
      code: "ROLE_CXO",
      validEndTime: "2027-10-31",
      account: "12345678",
      userName: "张三",
    },
  ],
  regionCodeList: [
    {
      name: "张三",
      code: "REGION_CN_EAST",
      validEndTime: "2027-10-31",
      account: "12345678",
      userName: "张三",
    },
    {
      name: "张三",
      code: "REGION_CN_WEST",
      validEndTime: "2027-10-31",
      account: "12345678",
      userName: "张三",
    },
    {
      name: "张三",
      code: "REGION_CN_SOUTH",
      validEndTime: "2027-10-31",
      account: "12345678",
      userName: "张三",
    },
  ],
  cloudServerNameList: [
    {
      name: "张三",
      code: "CLOUD_ECS",
      validEndTime: "2027-10-31",
      account: "12345678",
      userName: "张三",
    },
    {
      name: "张三",
      code: "CLOUD_OBS",
      validEndTime: "2027-10-31",
      account: "12345678",
      userName: "张三",
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
        dataRoleId: "CLOUD_ECS",
        validityPeriod: "2027-10-31",
      },
      {
        dataRoleId: "REGION_CN_EAST_ARSENAL",
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
        status: 200,
        massage: "success",
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
