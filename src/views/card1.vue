<template>
  <main class="card-page">
    <section class="permission-card">
      <header class="permission-card__header">
        <h1>切换角色</h1>
        <button class="apply-entry" type="button">
          <el-icon><Setting /></el-icon>
          <span>数据权限申请</span>
        </button>
      </header>

      <nav class="permission-tabs" aria-label="权限类型">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          class="permission-tabs__item"
          :class="{ 'permission-tabs__item--active': activeTab === tab.name }"
          type="button"
          @click="handleTabChange(tab.name)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <section v-if="activeTab === 'role'" class="role-panel">
        <article
          v-for="role in ownedRoles"
          :key="role.id"
          class="role-row"
        >
          <div class="avatar" :class="role.avatarClass" aria-hidden="true">
            <span class="avatar__hair" />
            <span class="avatar__face" />
            <span class="avatar__body" />
          </div>
          <div class="role-row__main">
            <h2>{{ role.name }}</h2>
            <p>到期时间：{{ role.expireDate }}</p>
          </div>
          <p class="role-row__approver">审批人：{{ role.approver }} {{ role.orderNo }}</p>
        </article>

        <div class="role-divider" />

        <h2 class="empty-title">未有角色权限(点击头像可直接申请业务角色权限)</h2>
        <article
          v-for="role in unavailableRoles"
          :key="role.id"
          class="role-row role-row--disabled"
        >
          <div class="avatar avatar--muted" :class="role.avatarClass" aria-hidden="true">
            <span class="avatar__hair" />
            <span class="avatar__face" />
            <span class="avatar__body" />
            <span class="avatar__mark" />
          </div>
          <div class="role-row__main">
            <h2>{{ role.name }}</h2>
            <p>有效时间：{{ role.validDate }}</p>
          </div>
          <p class="role-row__approver">审批人：{{ role.approver }} {{ role.orderNo }}</p>
        </article>
      </section>

      <section v-else class="data-panel">
        <article
          v-for="item in dataPermissions"
          :key="item.id"
          class="data-card"
        >
          <div class="data-card__meta">
            <strong>{{ item.name }}</strong>
            <span>到期时间：{{ item.expireDate }}</span>
            <span>审批人：{{ item.approver }} {{ item.orderNo }}</span>
          </div>
          <p>{{ item.regions }}</p>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { Setting } from "@element-plus/icons-vue";

const tabs = [
  { label: "已有角色权限", name: "role" },
  { label: "已有数据权限", name: "data" },
];

const activeTab = ref("role");

// 两个截图分别对应两个 Tab，静态数据用于 1:1 还原卡片视觉。
const ownedRoles = [
  {
    id: "cxo",
    name: "角色1",
    expireDate: "2027-02-18",
    approver: "张三",
    orderNo: "12345678",
    avatarClass: "avatar--one",
  },
  {
    id: "sales",
    name: "角色2",
    expireDate: "2027-02-18",
    approver: "张三",
    orderNo: "12345678",
    avatarClass: "avatar--two",
  },
  {
    id: "customer",
    name: "角色3",
    expireDate: "2027-02-18",
    approver: "张三",
    orderNo: "12345678",
    avatarClass: "avatar--three",
  },
  {
    id: "service-pe",
    name: "角色4",
    expireDate: "2027-02-18",
    approver: "张三",
    orderNo: "12345678",
    avatarClass: "avatar--four",
  },
];

const unavailableRoles = [
  {
    id: "operation",
    name: "角色5",
    validDate: "--",
    approver: "张三",
    orderNo: "12345678",
    avatarClass: "avatar--five",
  },
];

const dataPermissions = [
  {
    id: "ecs",
    name: "ABC",
    expireDate: "2027-10-31",
    approver: "张三",
    orderNo: "12345678",
    regions: "英超-阿森纳，西甲-皇家马德里，意甲-国际米兰，德甲-拜仁慕尼黑，法甲-巴黎圣日耳曼",
  },
  {
    id: "obs",
    name: "DEF",
    expireDate: "2027-10-31",
    approver: "张三",
    orderNo: "12345678",
    regions: "英超-利物浦，西甲-巴塞罗那，意甲-尤文图斯，德甲-多特蒙德，法甲-马赛",
  },
  {
    id: "xpu",
    name: "GHI",
    expireDate: "2027-10-31",
    approver: "张三",
    orderNo: "12345678",
    regions: "英超-曼城，西甲-马德里竞技，意甲-AC米兰，德甲-勒沃库森，法甲-里昂",
  },
];

const handleTabChange = (tabName) => {
  activeTab.value = tabName;
};
</script>

<style scoped lang="less">
.card-page {
  min-height: 100vh;
  padding: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #0f0e18;
}

.permission-card {
  width: min(100%, 960px);
  min-height: 1000px;
  padding: 72px 70px 64px;
  overflow: hidden;
  border-radius: 28px;
  background: #f6e7ff;
  box-shadow:
    inset 0 0 18px rgba(123, 79, 183, 0.26),
    0 0 0 2px rgba(123, 79, 183, 0.12);
  color: #392875;
}

.permission-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 62px;

  h1 {
    margin: 0;
    font-size: 38px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: 0;
  }
}

.apply-entry {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: transparent;
  color: #4f4382;
  font-size: 31px;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;

  .el-icon {
    font-size: 36px;
  }
}

.permission-tabs {
  position: relative;
  display: flex;
  gap: 54px;
  margin-bottom: 42px;
  border-bottom: 2px solid rgba(90, 67, 128, 0.18);
}

.permission-tabs__item {
  position: relative;
  height: 68px;
  border: 0;
  padding: 0;
  background: transparent;
  color: rgba(57, 40, 117, 0.56);
  font-size: 31px;
  line-height: 68px;
  font-weight: 500;
  cursor: pointer;
}

.permission-tabs__item--active {
  color: #392875;
  font-weight: 800;

  &::after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -3px;
    height: 5px;
    background: #46327e;
    content: "";
  }
}

.role-panel {
  padding-top: 4px;
}

.role-row {
  display: grid;
  grid-template-columns: 106px minmax(320px, 1fr) 330px;
  column-gap: 28px;
  align-items: center;
  min-height: 126px;
  margin-bottom: 12px;
}

.role-row__main {
  h2 {
    margin: 0 0 22px;
    color: #392875;
    font-size: 31px;
    line-height: 1.1;
    font-weight: 500;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: rgba(57, 40, 117, 0.38);
    font-size: 27px;
    line-height: 1.2;
  }
}

.role-row__approver {
  margin: 44px 0 0;
  color: rgba(57, 40, 117, 0.4);
  font-size: 27px;
  line-height: 1.2;
  white-space: nowrap;
}

.role-divider {
  height: 2px;
  margin: 36px 8px 46px;
  background: rgba(90, 67, 128, 0.14);
}

.empty-title {
  margin: 0 0 30px 8px;
  color: rgba(57, 40, 117, 0.52);
  font-size: 30px;
  line-height: 1.2;
  font-weight: 500;
}

.role-row--disabled {
  opacity: 0.72;
}

.avatar {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 40%, #f4b99e 0 20%, transparent 21%),
    linear-gradient(180deg, #d7c7ef 0%, #b7d2ff 100%);
  overflow: hidden;
}

.avatar__hair,
.avatar__face,
.avatar__body,
.avatar__mark {
  position: absolute;
  display: block;
}

.avatar__hair {
  left: 25px;
  top: 18px;
  width: 36px;
  height: 20px;
  border-radius: 50% 50% 40% 40%;
  background: #25204f;
}

.avatar__face {
  left: 28px;
  top: 30px;
  width: 30px;
  height: 32px;
  border-radius: 45% 45% 48% 48%;
  background: #f0b89f;
}

.avatar__body {
  left: 21px;
  bottom: -3px;
  width: 44px;
  height: 32px;
  border-radius: 18px 18px 0 0;
  background: #ffffff;
}

.avatar__mark {
  right: 4px;
  bottom: 2px;
  width: 22px;
  height: 22px;

  &::before,
  &::after {
    position: absolute;
    left: 10px;
    top: -2px;
    width: 3px;
    height: 28px;
    border-radius: 3px;
    background: #d84b73;
    content: "";
  }

  &::before {
    transform: rotate(42deg);
  }

  &::after {
    transform: rotate(-42deg);
  }
}

.avatar--two {
  background:
    radial-gradient(circle at 50% 40%, #e9b093 0 20%, transparent 21%),
    linear-gradient(180deg, #94c0ff 0%, #78a2f8 100%);

  .avatar__hair {
    top: 16px;
    background: #232050;
    transform: rotate(-8deg);
  }

  .avatar__body {
    background: #f4f6ff;
  }
}

.avatar--three {
  background:
    radial-gradient(circle at 50% 40%, #efb7a3 0 21%, transparent 22%),
    linear-gradient(180deg, #d5b7fa 0%, #dcd8ff 100%);

  .avatar__hair {
    left: 20px;
    top: 20px;
    width: 44px;
    height: 42px;
    border-radius: 48% 48% 44% 44%;
    background: #4c2967;
  }

  .avatar__body {
    background: #8877df;
  }
}

.avatar--four {
  background:
    radial-gradient(circle at 50% 40%, #e8b69d 0 20%, transparent 21%),
    linear-gradient(180deg, #b5c9ff 0%, #96b4fa 100%);

  .avatar__body {
    background: #313060;
  }
}

.avatar--five {
  background:
    radial-gradient(circle at 50% 40%, #ebbaa3 0 21%, transparent 22%),
    linear-gradient(180deg, #d7e5ff 0%, #cad9ff 100%);

  .avatar__hair {
    left: 21px;
    top: 19px;
    width: 42px;
    height: 43px;
    border-radius: 48% 48% 44% 44%;
    background: #6a477a;
  }

  .avatar__body {
    background: #fff4f4;
  }
}

.avatar--muted {
  filter: saturate(0.72);
}

.data-panel {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 18px 8px 0;
}

.data-card {
  min-height: 182px;
  padding: 34px 32px 28px;
  border: 1px solid rgba(83, 59, 128, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 0 0 1px rgba(107, 83, 156, 0.04),
    0 10px 28px rgba(111, 80, 145, 0.08);

  p {
    margin: 32px 0 0;
    color: #392875;
    font-size: 31px;
    line-height: 1.36;
    font-weight: 600;
  }
}

.data-card__meta {
  display: grid;
  grid-template-columns: 170px 1fr auto;
  gap: 12px;
  align-items: center;
  color: rgba(57, 40, 117, 0.34);
  font-size: 24px;
  line-height: 1.2;

  strong {
    color: #392875;
    font-size: 31px;
    line-height: 1.2;
  }

  span {
    white-space: nowrap;
  }
}

@media (max-width: 900px) {
  .card-page {
    padding: 16px;
  }

  .permission-card {
    padding: 44px 34px 48px;
    min-height: 860px;
  }

  .permission-card__header {
    margin-bottom: 42px;
  }

  .apply-entry,
  .permission-tabs__item,
  .data-card p,
  .role-row__main h2 {
    font-size: 24px;
  }

  .role-row {
    grid-template-columns: 84px 1fr;
    row-gap: 6px;
  }

  .role-row__approver {
    grid-column: 2;
    margin-top: 0;
    white-space: normal;
  }

  .data-card__meta {
    grid-template-columns: 1fr;
  }
}
</style>
