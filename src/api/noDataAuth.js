const serviceOptions = [
  {
    id: "service-ecs",
    name: "ABC",
    expireDate: "2027-10-31",
    approver: "张三",
    orderNo: "12345678",
  },
  {
    id: "service-obs",
    name: "DEF",
    expireDate: "2027-10-31",
    approver: "张三",
    orderNo: "12345678",
  },
  {
    id: "service-xpu",
    name: "GHI",
    expireDate: "2027-10-31",
    approver: "张三",
    orderNo: "12345678",
  },
];

const regionGroups = [
  {
    id: "north",
    name: "英超",
    children: [
      { id: "region-bj-1", name: "英超-阿森纳", area: "英超" },
      { id: "region-bj-2", name: "英超-切尔西", area: "英超" },
      { id: "region-bj-4", name: "英超-利物浦", area: "英超" },
      { id: "region-ul-1", name: "英超-曼城", area: "英超" },
      { id: "region-ul-auto-1", name: "英超-曼联", area: "英超" },
      { id: "region-north-3", name: "英超-热刺", area: "英超" },
    ],
  },
  {
    id: "east",
    name: "西甲",
    children: [
      { id: "region-sh-1", name: "西甲-皇马", area: "西甲" },
      { id: "region-sh-2", name: "西甲-巴萨", area: "西甲" },
      { id: "region-qingdao", name: "西甲-马竞", area: "西甲" },
      { id: "region-east-2", name: "西甲-塞维利亚", area: "西甲" },
    ],
  },
  {
    id: "south",
    name: "德甲",
    children: [
      { id: "region-gz-1", name: "德甲-拜仁", area: "德甲" },
      { id: "region-sz-1", name: "德甲-多特蒙德", area: "德甲" },
      { id: "region-hk-1", name: "德甲-勒沃库森", area: "德甲" },
    ],
  },
];

const statusTextMap = {
  waiting: "未拥有",
  owned: "已拥有",
  approving: "审批中",
};

let applications = [
  {
    id: "app-1001",
    status: "approving",
    serviceIds: ["service-ecs", "service-obs"],
    regionIds: ["region-bj-1", "region-sh-1"],
    reason: "项目联调需要临时开通数据权限。",
    createdAt: "2026-06-21 10:00",
  },
];

let recordSeed = 1002;

const waitMock = (data) =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        code: 0,
        data,
      });
    }, 220);
  });

const clone = (value) => JSON.parse(JSON.stringify(value));

const getServiceNames = (serviceIds) =>
  serviceIds
    .map((serviceId) => serviceOptions.find((service) => service.id === serviceId).name)
    .join("、");

const getRegionNames = (regionIds) => {
  const regions = regionGroups.flatMap((group) => group.children);

  return regionIds
    .map((regionId) => regions.find((region) => region.id === regionId).name)
    .join("、");
};

const toRecordView = (record) => ({
  ...record,
  statusText: statusTextMap[record.status],
  serviceNames: getServiceNames(record.serviceIds),
  regionNames: getRegionNames(record.regionIds),
});

export const getNoDataAuthOptions = () =>
  waitMock({
    services: clone(serviceOptions),
    regions: clone(regionGroups),
  });

export const getNoDataAuthList = (params) => {
  let list = applications;

  if (params.status !== "all") {
    list = list.filter((record) => record.status === params.status);
  }

  return waitMock(clone(list.map(toRecordView)));
};

export const createNoDataAuth = (payload) => {
  const record = {
    id: `app-${recordSeed}`,
    status: "approving",
    serviceIds: payload.serviceIds,
    regionIds: payload.regionIds,
    reason: payload.reason,
    createdAt: payload.createdAt,
  };

  recordSeed += 1;
  applications = [record, ...applications];

  return waitMock(clone(toRecordView(record)));
};

export const updateNoDataAuth = (id, payload) => {
  applications = applications.map((record) => {
    if (record.id !== id) {
      return record;
    }

    return {
      ...record,
      serviceIds: payload.serviceIds,
      regionIds: payload.regionIds,
      reason: payload.reason,
    };
  });

  const current = applications.find((record) => record.id === id);

  return waitMock(clone(toRecordView(current)));
};

export const deleteNoDataAuth = (id) => {
  applications = applications.filter((record) => record.id !== id);

  return waitMock({
    id,
  });
};
