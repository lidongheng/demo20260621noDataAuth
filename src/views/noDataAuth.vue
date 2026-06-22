<template>
  <main class="no-data-auth">
    <section class="no-data-auth__content">
      <header class="page-title">
        <h1>您没有当前页面的数据权限</h1>
        <el-tooltip content="可选择角色、Region 和数据类型后发起权限申请" placement="right">
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
          <h2 class="owned-section__title">角色</h2>
          <div class="owned-list">
            <button
              v-for="role in roles"
              :key="role.code"
              class="owned-card"
              type="button"
            >
              <span class="owned-card__name">
                <span class="owned-card__checkbox" aria-hidden="true" />
                <el-icon><Grid /></el-icon>
                {{ role.name }}
              </span>
              <span class="owned-card__meta">
                {{ role.code }}
              </span>
            </button>
          </div>
        </div>

        <div class="owned-section">
          <h2 class="owned-section__title">Region</h2>
          <div class="owned-list">
            <button
              v-for="region in ownedRegions"
              :key="region.code"
              class="owned-card"
              type="button"
            >
              <span class="owned-card__name">
                <span class="owned-card__checkbox" aria-hidden="true" />
                <el-icon><Grid /></el-icon>
                {{ region.name }}
              </span>
              <span class="owned-card__meta">
                {{ region.code }} {{ region.expireDate }}到期 审批人：{{ region.approver }} {{ region.orderNo }}
              </span>
            </button>
          </div>
        </div>

        <div class="owned-section">
          <h2 class="owned-section__title">数据类型</h2>
          <div class="owned-list">
            <button
              v-for="dataType in dataTypes"
              :key="dataType.code"
              class="owned-card"
              type="button"
            >
              <span class="owned-card__name">
                <span class="owned-card__checkbox" aria-hidden="true" />
                <el-icon><Grid /></el-icon>
                {{ dataType.name }}
              </span>
              <span class="owned-card__meta">
                {{ dataType.code }}
              </span>
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
        <el-form-item label="角色" prop="roleCodes" required>
          <div class="service-grid">
            <button
              v-for="role in roles"
              :key="role.code"
              class="resource-card"
              :class="{ 'resource-card--active': form.roleCodes.includes(role.code) }"
              type="button"
              @click="toggleRole(role.code)"
            >
              <span class="resource-card__name">
                <span class="resource-card__checkbox" aria-hidden="true" />
                <el-icon><Grid /></el-icon>
                {{ role.name }}
              </span>
              <span class="resource-card__meta">
                {{ role.code }}
              </span>
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
                      <el-icon><Grid /></el-icon>
                      {{ region.name }}
                    </span>
                    <span class="resource-card__meta">{{ region.code }}</span>
                  </button>
                </div>
              </div>
            </el-scrollbar>
          </section>
        </el-form-item>

        <el-form-item label="数据类型" prop="dataTypeCodes" required>
          <div class="service-grid">
            <button
              v-for="dataType in dataTypes"
              :key="dataType.code"
              class="resource-card"
              :class="{ 'resource-card--active': form.dataTypeCodes.includes(dataType.code) }"
              type="button"
              @click="toggleDataType(dataType.code)"
            >
              <span class="resource-card__name">
                <span class="resource-card__checkbox" aria-hidden="true" />
                <el-icon><Grid /></el-icon>
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
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Grid, QuestionFilled, Search } from "@element-plus/icons-vue";
import {
  createNoDataAuth,
  getNoDataAuthList,
  getNoDataAuthOptions,
} from "@/api/noDataAuth";

const activeStatus = ref("waiting");
const areaFilter = ref("all");
const formRef = ref();
const keyword = ref("");
const openedGroups = ref([]);
const roles = ref([]);
const regionGroups = ref([]);
const dataTypes = ref([]);
const approvingRows = ref([]);
const submitLoading = ref(false);

const form = reactive({
  roleCodes: [],
  regionCodes: [],
  dataTypeCodes: [],
  reason: "",
});

const rules = {
  roleCodes: [{ required: true, message: "请选择角色", trigger: "change" }],
  regionCodes: [{ required: true, message: "请选择Region", trigger: "change" }],
  dataTypeCodes: [{ required: true, message: "请选择数据类型", trigger: "change" }],
  reason: [{ required: true, message: "请输入申请原因", trigger: "blur" }],
};

const areaOptions = computed(() => regionGroups.value.map((group) => group.name));

const ownedRegions = computed(() =>
  regionGroups.value
    .flatMap((group) => group.children)
    .map((region) => ({
      ...region,
      expireDate: "2027-10-31",
      approver: "张三",
      orderNo: "12345678",
    }))
);

const visibleRegionGroups = computed(() => {
  const groups = regionGroups.value.filter((group) => {
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
  const regionGroupsByCode = response.data.regionCodeList.map((region) => ({
    id: region.code,
    name: region.name,
    children: region.children,
  }));

  roles.value = response.data.ruleCodeList;
  regionGroups.value = regionGroupsByCode;
  dataTypes.value = response.data.dataTypeList;
  openedGroups.value = regionGroupsByCode.map((group) => group.id);
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

const toggleRole = (code) => {
  form.roleCodes = toggleById(form.roleCodes, code);
  formRef.value.validateField("roleCodes");
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
  form.roleCodes = [];
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
        ...form.roleCodes,
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

.owned-section__title::before {
  margin-right: 6px;
  color: #f56c6c;
  content: "*";
}

.owned-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.owned-card__checkbox {
  width: 14px;
  height: 14px;
  border: 1px solid #d8dce8;
  border-radius: 2px;
  background: #fff;
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
  grid-template-columns: auto 160px 1fr;
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

  .region-toolbar {
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
