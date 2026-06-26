<template>
  <main class="no-data-auth">
    <section class="no-data-auth__content">
      <header class="page-title">
        <h1>您没有当前页面的数据权限</h1>
        <el-tooltip content="可选择云服务、Region 和数据类型后发起权限申请" placement="right">
          <el-icon class="page-title__icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </header>

      <el-tabs v-model="activeStatus" class="status-tabs" @tab-change="handleStatusChange">
        <el-tab-pane label="未拥有" name="waiting" />
        <el-tab-pane label="已拥有" name="owned" />
        <el-tab-pane label="审批中" name="approving" />
      </el-tabs>

      <section v-if="activeStatus === 'owned'" class="owned-auth">
        <div class="owned-section">
          <h2 class="owned-section__title">云服务</h2>
          <div class="owned-list">
            <button
              v-for="cloudServer in ownedCloudServers"
              :key="cloudServer.code"
              class="owned-card"
              type="button"
            >
              <span class="owned-card__name">
                <FourGridIcon />
                {{ cloudServer.code }}
              </span>
              <span class="owned-card__meta" />
            </button>
          </div>
        </div>

        <div class="owned-section">
          <h2 class="owned-section__title">Region</h2>
          <div class="owned-list owned-list--region">
            <button
              v-for="region in ownedRegions"
              :key="region.code"
              class="owned-card"
              type="button"
            >
              <span class="owned-card__name">
                <FourGridIcon />
                {{ region.code }}
              </span>
              <span class="owned-card__meta" />
            </button>
          </div>
        </div>

        <div class="owned-section">
          <h2 class="owned-section__title">数据类型</h2>
          <div class="owned-list">
            <button
              v-for="dataType in ownedDataTypes"
              :key="dataType.code"
              class="owned-card"
              type="button"
            >
              <span class="owned-card__name">
                <FourGridIcon />
                {{ dataType.code }}
              </span>
              <span class="owned-card__meta" />
            </button>
          </div>
        </div>
      </section>

      <section v-else-if="activeStatus === 'approving'" class="approving-table">
        <el-table :data="approvingRows" class="approving-table__inner">
          <el-table-column prop="index" label="序号" min-width="90" sortable />
          <el-table-column prop="user" label="申请人" min-width="160" sortable />
          <el-table-column prop="order" label="工单号" min-width="220" sortable />
          <el-table-column prop="title" label="工单标题" min-width="260" sortable />
          <el-table-column prop="status" label="状态" min-width="160" sortable />
          <el-table-column prop="approver" label="当前处理人" min-width="220" sortable />
        </el-table>
      </section>

      <el-form
        v-else
        ref="formRef"
        :model="form"
        :rules="rules"
        class="apply-form"
        label-position="top"
      >
        <el-form-item label="云服务" prop="cloudServerCodes" required>
          <div class="service-grid">
            <button
              v-for="cloudServer in unownedCloudServers"
              :key="cloudServer.code"
              class="resource-card"
              :class="{ 'resource-card--active': form.cloudServerCodes.includes(cloudServer.code) }"
              type="button"
              @click="toggleCloudServer(cloudServer.code)"
            >
              <span class="resource-card__name">
                <span class="resource-card__checkbox" aria-hidden="true" />
                <FourGridIcon />
                {{ cloudServer.code }}
              </span>
              <span class="resource-card__meta" />
            </button>
          </div>
        </el-form-item>

        <el-form-item label="Region" prop="regionCodes" required>
          <section class="region-panel">
            <div class="region-toolbar">
              <label class="region-toolbar__label">大区</label>
              <el-select v-model="areaFilter" class="region-toolbar__select" @change="handleAreaChange">
                <el-option label="全部" value="all" />
                <el-option
                  v-for="area in areaOptions"
                  :key="area"
                  :label="area"
                  :value="area"
                />
              </el-select>
              <el-input
                v-model="keyword"
                class="region-toolbar__search"
                placeholder="请输入Region名称"
                clearable
                @input="handleKeywordChange"
              >
                <template #suffix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>

            <el-scrollbar class="region-scroll">
              <div
                v-for="group in visibleRegionGroups"
                :key="group.id"
                class="region-group"
              >
                <button
                  class="region-group__title"
                  type="button"
                  @click="toggleGroup(group.id)"
                >
                  <span class="region-group__arrow" :class="{ 'region-group__arrow--open': openedGroups.includes(group.id) }">
                    ›
                  </span>
                  {{ group.name }}
                </button>
                <div
                  v-if="openedGroups.includes(group.id)"
                  class="region-grid"
                >
                  <button
                    v-for="region in group.children"
                    :key="region.code"
                    class="resource-card resource-card--region"
                    :class="{ 'resource-card--active': form.regionCodes.includes(region.code) }"
                    type="button"
                    @click="toggleRegion(region.code)"
                  >
                    <span class="resource-card__name">
                      <span class="resource-card__checkbox" aria-hidden="true" />
                      <FourGridIcon />
                      {{ region.name }}
                    </span>
                    <span class="resource-card__meta" />
                  </button>
                </div>
              </div>
            </el-scrollbar>
          </section>
        </el-form-item>

        <el-form-item label="数据类型" prop="dataTypeCodes" required>
          <div class="service-grid">
            <button
              v-for="dataType in unownedDataTypes"
              :key="dataType.code"
              class="resource-card"
              :class="{ 'resource-card--active': form.dataTypeCodes.includes(dataType.code) }"
              type="button"
              @click="toggleDataType(dataType.code)"
            >
              <span class="resource-card__name">
                <span class="resource-card__checkbox" aria-hidden="true" />
                <FourGridIcon />
                {{ dataType.code }}
              </span>
              <span class="resource-card__meta" />
            </button>
          </div>
        </el-form-item>

        <el-form-item label="申请原因" prop="reason" required>
          <div class="reason-input">
            <el-input
              v-model="form.reason"
              maxlength="200"
              placeholder="请输入申请原因"
            />
            <span class="reason-input__count">{{ form.reason.length }} / 200</span>
          </div>
        </el-form-item>

        <div class="form-actions">
          <el-button class="quick-apply-button" :loading="submitLoading" @click="handleSubmit">
            快捷申请
          </el-button>
        </div>
      </el-form>
    </section>
  </main>
</template>

<script setup>
import { computed, h, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { QuestionFilled, Search } from "@element-plus/icons-vue";
import {
  createNoDataAuth,
  getNoDataAuthList,
  getNoDataAuthOptions,
} from "@/api/noDataAuth";

const FourGridIcon = {
  name: "FourGridIcon",
  render() {
    return h(
      "span",
      {
        class: "four-grid-icon",
        "aria-hidden": "true",
      },
      [h("span"), h("span"), h("span"), h("span")]
    );
  },
};

const activeStatus = ref("waiting");
const areaFilter = ref("all");
const formRef = ref();
const keyword = ref("");
const openedGroups = ref([]);
const unownedCloudServers = ref([]);
const unownedRegionGroups = ref([]);
const unownedDataTypes = ref([]);
const ownedCloudServers = ref([]);
const ownedRegions = ref([]);
const ownedDataTypes = ref([]);
const approvingRows = ref([]);
const submitLoading = ref(false);

const form = reactive({
  cloudServerCodes: [],
  regionCodes: [],
  dataTypeCodes: [],
  reason: "",
});

const rules = {
  cloudServerCodes: [{ required: true, message: "请选择云服务", trigger: "change" }],
  regionCodes: [{ required: true, message: "请选择Region", trigger: "change" }],
  dataTypeCodes: [{ required: true, message: "请选择数据类型", trigger: "change" }],
  reason: [{ required: true, message: "请输入申请原因", trigger: "blur" }],
};

const areaOptions = computed(() => unownedRegionGroups.value.map((group) => group.name));

const visibleRegionGroups = computed(() => {
  const groups = unownedRegionGroups.value.filter((group) => {
    if (areaFilter.value === "all") {
      return true;
    }

    return group.name === areaFilter.value;
  });

  if (!keyword.value) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      children: group.children.filter((region) => region.name.includes(keyword.value)),
    }))
    .filter((group) => group.children.length > 0);
});

const loadOptions = async () => {
  const response = await getNoDataAuthOptions();
  const optionData = response.data;

  if (optionData === null || Array.isArray(optionData)) {
    // 后端业务状态异常时 HTTP 仍为 200，页面按空权限数据展示。
    unownedCloudServers.value = [];
    unownedRegionGroups.value = [];
    unownedDataTypes.value = [];
    ownedCloudServers.value = [];
    ownedRegions.value = [];
    ownedDataTypes.value = [];
    openedGroups.value = [];
    return;
  }

  const dataTypeDimension = optionData.totalDimenPermConfigList.find(
    (dimension) => dimension.permDimenTypeCode === "3"
  );
  const cloudServerDimension = optionData.totalDimenPermConfigList.find(
    (dimension) => dimension.permDimenTypeCode === "4"
  );
  const regionDimension = optionData.totalDimenPermConfigList.find(
    (dimension) => dimension.permDimenTypeCode === "5"
  );
  const maskedLeagues = ["英超", "西甲", "意甲", "德甲", "法甲"];
  const maskedTeams = [
    "阿森纳",
    "切尔西",
    "利物浦",
    "皇家马德里",
    "巴塞罗那",
    "国际米兰",
    "拜仁慕尼黑",
    "巴黎圣日耳曼",
  ];
  const regionGroupMap = new Map();

  // 分组依据使用真实名称，子项只替换展示名称，权限编码保持接口原值。
  regionDimension.detailList.forEach((region, index) => {
    const groupName = region.permName.split("-")[0];

    if (!regionGroupMap.has(groupName)) {
      regionGroupMap.set(groupName, {
        id: groupName,
        name: groupName,
        children: [],
      });
    }

    regionGroupMap.get(groupName).children.push({
      code: region.permCode,
      name: `${maskedLeagues[index % maskedLeagues.length]}-${
        maskedTeams[index % maskedTeams.length]
      }`,
    });
  });

  const unownedRegionGroupsByCode = Array.from(regionGroupMap.values());

  unownedCloudServers.value = cloudServerDimension.detailList.map((item) => ({
    code: item.permCode,
    name: item.permName,
  }));
  unownedRegionGroups.value = unownedRegionGroupsByCode;
  unownedDataTypes.value = dataTypeDimension.detailList.map((item) => ({
    code: item.permCode,
    name: item.permName,
  }));
  ownedCloudServers.value = optionData.cloudServerNameList;
  ownedRegions.value = optionData.regionCodeList;
  ownedDataTypes.value = optionData.dataTypeCodeList;
  openedGroups.value = unownedRegionGroupsByCode.map((group) => group.id);
};

const loadApprovingRows = async () => {
  const response = await getNoDataAuthList({
    account: "12345678",
    status: "approving",
  });

  approvingRows.value = response.data.map((row, index) => ({
    index: index + 1,
    ...row,
  }));
};

const toggleById = (list, id) => {
  if (list.includes(id)) {
    return list.filter((currentId) => currentId !== id);
  }

  return [...list, id];
};

const toggleCloudServer = (code) => {
  form.cloudServerCodes = toggleById(form.cloudServerCodes, code);
  formRef.value.validateField("cloudServerCodes");
};

const toggleRegion = (code) => {
  form.regionCodes = toggleById(form.regionCodes, code);
  formRef.value.validateField("regionCodes");
};

const toggleDataType = (code) => {
  form.dataTypeCodes = toggleById(form.dataTypeCodes, code);
  formRef.value.validateField("dataTypeCodes");
};

const toggleGroup = (id) => {
  openedGroups.value = toggleById(openedGroups.value, id);
};

const handleAreaChange = () => {
  openedGroups.value = visibleRegionGroups.value.map((group) => group.id);
};

const handleKeywordChange = () => {
  openedGroups.value = visibleRegionGroups.value.map((group) => group.id);
};

const resetForm = () => {
  form.cloudServerCodes = [];
  form.regionCodes = [];
  form.dataTypeCodes = [];
  form.reason = "";
  formRef.value.clearValidate();
};

const handleSubmit = async () => {
  await formRef.value.validate();
  submitLoading.value = true;

  try {
    const payload = {
      userId: "12345678",
      tenant: "",
      description: form.reason,
      dataRoleList: [
        ...form.cloudServerCodes,
        ...form.regionCodes,
        ...form.dataTypeCodes,
      ].map((dataRoleId) => ({
        dataRoleId,
        validityPeriod: "2027-10-31",
      })),
    };

    await createNoDataAuth(payload);
    ElMessage.success("快捷申请已提交，后续跳转页面待接入");
    await loadApprovingRows();

    resetForm();
  } finally {
    submitLoading.value = false;
  }
};

const handleStatusChange = async (status) => {
  if (status === "approving") {
    await loadApprovingRows();
  }
};

onMounted(async () => {
  await loadOptions();
  await loadApprovingRows();
});
</script>

<style lang="less" scoped>
.no-data-auth {
  min-height: 100vh;
  padding: 56px 96px;
  overflow-x: hidden;
  background: #f7f8fc;
}

.no-data-auth__content {
  width: min(1180px, 100%);
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
}

.page-title h1 {
  margin: 0;
  color: #2f3555;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
}

.page-title__icon {
  color: #59607d;
  cursor: help;
}

.status-tabs {
  margin-bottom: 12px;
}

.apply-form {
  padding-bottom: 28px;
}

.owned-auth {
  padding-bottom: 28px;
}

.owned-section + .owned-section {
  margin-top: 26px;
}

.approving-table {
  padding-top: 18px;
}

.approving-table__inner {
  width: 100%;
  background: transparent;
}

.approving-table :deep(.el-table__header th) {
  color: #515873;
  background: #f3f5fb;
  font-size: 16px;
  font-weight: 700;
}

.approving-table :deep(.el-table__header .cell) {
  line-height: 32px;
}

.approving-table :deep(.el-table__header th.el-table__cell) {
  padding: 2px 0;
}

.approving-table :deep(.el-table__cell) {
  border-bottom: 0;
}

.approving-table :deep(.el-table__empty-block) {
  min-height: 120px;
}

.approving-table :deep(.el-table__empty-text) {
  color: #7e849b;
  font-size: 16px;
}

.approving-table :deep(.el-table::before) {
  display: none;
}

.owned-section__title {
  margin: 0 0 14px;
  color: #2f3555;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
}

.owned-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.owned-list--region {
  max-height: 364px;
  padding-right: 8px;
  overflow-y: auto;
}

.owned-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  padding: 0 18px;
  border: 1px solid #e4e7ed;
  border-radius: 3px;
  color: #3c4264;
  background: #fff;
  cursor: pointer;
}

.owned-card__name {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.owned-card__meta {
  color: #8a90a8;
  font-size: 14px;
  white-space: nowrap;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
  width: 100%;
}

.resource-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid #e4e7ed;
  border-radius: 2px;
  color: #3c4264;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.resource-card:hover,
.resource-card--active {
  border-color: #4865d9;
  color: #3150cc;
  box-shadow: 0 0 0 1px rgba(72, 101, 217, 0.16);
}

.resource-card__name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-weight: 600;
  white-space: nowrap;
}

.four-grid-icon {
  display: inline-grid;
  grid-template-columns: repeat(2, 6px);
  gap: 1px;
  color: #4865d9;
}

.four-grid-icon :deep(span) {
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: currentColor;
}

.resource-card__checkbox {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid #b8bfd6;
  border-radius: 2px;
  background: #fff;
}

.resource-card--active .resource-card__checkbox {
  border-color: #4865d9;
  background: #4865d9;
}

.resource-card--active .resource-card__checkbox::after {
  position: absolute;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  content: "";
  transform: rotate(45deg);
}

.resource-card__meta {
  color: #8a90a8;
  font-size: 13px;
  white-space: nowrap;
}

.region-panel {
  width: 100%;
  padding: 18px 0 8px;
  border: 1px solid #e4e7ed;
  background: #fff;
}

.region-toolbar {
  display: grid;
  grid-template-columns: auto 160px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 0 18px 16px;
}

.region-toolbar__label {
  color: #4a506e;
  font-weight: 600;
}

.region-toolbar__select {
  width: 160px;
}

.region-toolbar__search {
  min-width: 0;
  width: 100%;
}

.region-scroll {
  height: 360px;
  padding: 0 18px;
}

.region-group + .region-group {
  margin-top: 12px;
}

.region-group__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0;
  border: 0;
  color: #4a506e;
  background: transparent;
  font-weight: 600;
  cursor: pointer;
}

.region-group__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #6e7490;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}

.region-group__arrow--open {
  transform: rotate(90deg);
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 22px;
  padding: 10px 0 12px 28px;
}

.resource-card--region {
  justify-content: flex-start;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 12px;
}

.reason-input {
  position: relative;
  width: 100%;
}

.reason-input :deep(.el-input__wrapper) {
  padding-right: 72px;
}

.reason-input__count {
  position: absolute;
  top: 50%;
  right: 12px;
  color: #909399;
  font-size: 12px;
  line-height: 1;
  transform: translateY(-50%);
}

.quick-apply-button {
  width: 96px;
  height: 34px;
  border-color: #4865d9;
  color: #fff;
  background: #4865d9;
}

.quick-apply-button:hover,
.quick-apply-button:focus {
  border-color: #4865d9;
  color: #fff;
  background: #4865d9;
}

:deep(.el-tabs__item) {
  display: inline-flex;
  align-items: center;
  min-width: 96px;
  height: 34px;
  padding: 0 20px !important;
  box-sizing: border-box;
  justify-content: center;
  color: #4f5570;
  background: #f1f3fa;
  font-weight: 600;
  line-height: 34px;
  text-align: center;
}

:deep(.el-tabs__item:first-child),
:deep(.el-tabs__item:last-child) {
  padding: 0 20px !important;
}

:deep(.el-tabs__item.is-active) {
  color: #fff;
  background: #4865d9;
}

:deep(.el-tabs__active-bar) {
  display: none;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-form-item__label) {
  color: #2f3555;
  font-size: 18px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .no-data-auth {
    padding: 40px 24px;
  }

  .owned-card {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 12px 18px;
  }

  .owned-card__meta {
    white-space: normal;
  }

  .service-grid,
  .region-grid {
    grid-template-columns: 1fr;
  }

  .resource-card {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    min-height: 64px;
  }

  .resource-card__meta {
    white-space: normal;
  }
}
</style>
