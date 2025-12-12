<template>
  <div class="transaction-progress">
    <div class="header">
      <div class="filter-bar">
        <div class="filter-container">
          <!-- 合并的筛选折叠面板 -->
          <van-collapse v-model="activeNames" class="filter-collapse">
            <!-- 时间范围筛选 -->
            <van-collapse-item name="time">
              <template #title>
                <div class="filter-dropdown">
                  <span>{{ selectedTimeText }}</span>
                  <van-icon :name="activeNames.includes('time') || activeNames.includes('type') ? 'arrow-up' : 'arrow-down'" />
                </div>
              </template>
              <div class="panel-content">
                <div class="panel-title">交易日期</div>
                <div class="button-group">
                  <van-button 
                    v-for="option in timeOptions" 
                    :key="option.value"
                    type="default"
                    size="small"
                    :plain="selectedTime !== option.value"
                    :color="selectedTime === option.value ? '#1989fa' : ''"
                    @click="selectedTime = option.value"
                  >
                    {{ option.text }}
                  </van-button>
                </div>
                <div class="panel-buttons">
                  <van-button type="default" @click="resetTime" size="large" :style="{ marginRight: '20px', borderColor: '#1989fa', color: '#1989fa' }">重置</van-button>
                  <van-button type="primary" @click="confirmTime" size="large" :style="{ backgroundColor: '#1989fa' }">确定</van-button>
                </div>
              </div>
            </van-collapse-item>
            
            <!-- 交易类型筛选 -->
            <van-collapse-item name="type">
              <template #title>
                <div class="filter-dropdown">
                  <span>{{ selectedTypeText }}</span>
                </div>
              </template>
              <div class="panel-content">
                <div class="panel-title">交易类型</div>
                <div class="button-group">
                  <van-button 
                    v-for="option in typeOptions" 
                    :key="option.value"
                    type="default"
                    size="small"
                    :plain="selectedType !== option.value"
                    :color="selectedType === option.value ? '#1989fa' : ''"
                    @click="selectedType = option.value"
                  >
                    {{ option.text }}
                  </van-button>
                </div>
                <div class="panel-buttons">
                  <van-button type="default" @click="resetType" size="large" :style="{ marginRight: '20px', borderColor: '#1989fa', color: '#1989fa' }">重置</van-button>
                  <van-button type="primary" @click="confirmType" size="large" :style="{ backgroundColor: '#1989fa' }">确定</van-button>
                </div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
        
        <!-- 筛选更多图标 -->
        <div class="filter-more" @click="toggleFilterPanel">
          <van-icon name="filter" />
        </div>
      </div>
      

      
      <!-- 更多筛选弹窗：从右侧弹出 -->
        <van-popup v-model="showFilterPanel" position="right" :style="{ width: '80%', height: '100%' }">
        <div class="filter-popup-content">
          <div class="filter-popup-header">
            <h3>筛选条件</h3>
            <van-icon name="close" @click="showFilterPanel = false" />
          </div>
          <div class="filter-popup-body">
            <!-- 审批进度筛选 -->
            <div class="filter-item">
              <div class="filter-label">审批进度</div>
              <div class="filter-select" @click="toggleApprovalProgressPanel">
                <span>{{ selectedApprovalProgressText }}</span>
                <van-icon :name="approvalProgressPanelVisible ? 'arrow-up' : 'arrow-down'" />
              </div>
            </div>
            
            <!-- 交易进度筛选 -->
            <div class="filter-item">
              <div class="filter-label">交易进度</div>
              <div class="filter-select" @click="toggleTransactionProgressPanel">
                <span>{{ selectedTransactionProgressText }}</span>
                <van-icon :name="transactionProgressPanelVisible ? 'arrow-up' : 'arrow-down'" />
              </div>
            </div>
          </div>
          <div class="filter-popup-footer">
            <van-button type="default" @click="resetFilter" size="large" :style="{ marginRight: '20px', borderColor: '#1989fa', color: '#1989fa' }">重置</van-button>
            <van-button type="primary" @click="confirmFilter" size="large" :style="{ backgroundColor: '#1989fa' }">确定</van-button>
          </div>
        </div>
      </van-popup>
      
      <!-- 审批进度弹出选择器：从下往上弹出 -->
      <van-popup v-model="approvalProgressPanelVisible" position="bottom" :style="{ height: '450px' }">
        <div class="filter-popup-content">
          <div class="filter-popup-header">
            <h3>审批进度</h3>
            <van-icon name="close" @click="approvalProgressPanelVisible = false" />
          </div>
          <div class="filter-popup-body">
            <div 
              v-for="option in approvalProgressOptions" 
              :key="option.value"
              class="filter-option-item"
              :class="{ active: selectedApprovalProgress === option.value }"
              @click="selectApprovalProgress(option)"
            >
              {{ option.text }}
            </div>
          </div>
        </div>
      </van-popup>
      
      <!-- 交易进度弹出选择器：从下往上弹出 -->
      <van-popup v-model="transactionProgressPanelVisible" position="bottom" :style="{ height: '450px' }">
        <div class="filter-popup-content">
          <div class="filter-popup-header">
            <h3>交易进度</h3>
            <van-icon name="close" @click="transactionProgressPanelVisible = false" />
          </div>
          <div class="filter-popup-body">
            <div 
              v-for="option in transactionProgressOptions" 
              :key="option.value"
              class="filter-option-item"
              :class="{ active: selectedTransactionProgress === option.value }"
              @click="selectTransactionProgress(option)"
            >
              {{ option.text }}
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    
    <!-- 交易进度列表 -->
    <div class="content">
      <div class="record-item" v-for="(record, index) in transactionRecords" :key="index">
        <div class="record-header">
          <span class="record-type">{{ record.type }}</span>
          <van-tag :type="getStatusType(record.status)" size="small">{{ record.statusText }}</van-tag>
        </div>
        <div class="record-body">
          <div class="record-row">
            <span class="record-label">交易状态</span>
            <span class="record-value">{{ record.transactionStatus }}</span>
          </div>
          <div class="record-row">
            <span class="record-label">提交时间</span>
            <span class="record-value">{{ record.submitTime }}</span>
          </div>
          <div class="record-row">
            <span class="record-label">提交人</span>
            <span class="record-value">{{ record.submitter }}</span>
          </div>
          <div class="record-row">
            <span class="record-label">办案单位</span>
            <span class="record-value">{{ record.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionProgress',
  data() {
    return {
      activeNames: [], // 控制折叠面板的展开状态
      // 时间筛选相关
      selectedTime: 0,
      timeOptions: [
        { text: '最近一周', value: 0 },
        { text: '最近一个月', value: 1 },
        { text: '最近三个月', value: 2 }
      ],
      expandedTimeOptions: [
        { text: '最近一周', value: 0 },
        { text: '最近一月', value: 1 },
        { text: '最近三月', value: 2 },
        { text: '最近一年', value: 3 },
        { text: '最近三年', value: 4 }
      ],
      // 交易类型筛选相关
      selectedType: 0,
      typeOptions: [
        { text: '全部类型', value: 0 },
        { text: '案款转出', value: 1 },
        { text: '案款调账', value: 2 },
        { text: '不明款认领', value: 3 }
      ],
      // 更多筛选弹窗相关
      showFilterPanel: false,
      // 审批进度筛选相关
      approvalProgressPanelVisible: false,
      selectedApprovalProgress: 0,
      approvalProgressOptions: [
        { text: '全部', value: 0 },
        { text: '等待复核', value: 1 },
        { text: '复核通过', value: 2 },
        { text: '复核拒绝', value: 3 },
        { text: '取消', value: 4 }
      ],
      // 交易进度筛选相关
      transactionProgressPanelVisible: false,
      selectedTransactionProgress: 0,
      transactionProgressOptions: [
        { text: '全部', value: 0 },
        { text: '待处理', value: 1 },
        { text: '处理中', value: 2 },
        { text: '已完成', value: 3 },
        { text: '已失败', value: 4 }
      ],
      // 模拟交易进度数据
      transactionRecords: [
        {
          type: '案款转出',
          status: 0,
          statusText: '等待复核',
          transactionStatus: '银行处理中',
          submitTime: '2025-12-01 15:29:26',
          submitter: '李某某',
          unit: '福田派出所'
        },
        {
          type: '案款转出',
          status: 1,
          statusText: '复核拒绝',
          transactionStatus: '银行处理中',
          submitTime: '2025-12-01 15:29:26',
          submitter: '李某某',
          unit: '福田派出所'
        },
        {
          type: '案款转出',
          status: 2,
          statusText: '复核通过',
          transactionStatus: '银行处理中',
          submitTime: '2025-12-01 15:29:26',
          submitter: '李某某',
          unit: '福田派出所'
        },
        {
          type: '案款调账',
          status: 0,
          statusText: '等待复核',
          transactionStatus: '银行处理中',
          submitTime: '2025-12-01 15:29:26',
          submitter: '王某某',
          unit: '南山派出所'
        },
        {
          type: '不明款认领',
          status: 2,
          statusText: '复核通过',
          transactionStatus: '银行处理中',
          submitTime: '2025-12-01 15:29:26',
          submitter: '张某某',
          unit: '罗湖派出所'
        }
      ]
    }
  },
  computed: {
    selectedTimeText() {
      const option = this.timeOptions.find(opt => opt.value === this.selectedTime);
      return option ? option.text : '最近一周';
    },
    selectedTypeText() {
      const option = this.typeOptions.find(opt => opt.value === this.selectedType);
      return option ? option.text : '全部类型';
    },
    selectedApprovalProgressText() {
      const option = this.approvalProgressOptions.find(opt => opt.value === this.selectedApprovalProgress);
      return option ? option.text : '全部';
    },
    selectedTransactionProgressText() {
      const option = this.transactionProgressOptions.find(opt => opt.value === this.selectedTransactionProgress);
      return option ? option.text : '全部';
    }
  },
  methods: {

    resetTime() {
      this.selectedTime = 0;
    },
    confirmTime() {
      this.showTimePanel = false;
      // 更新时间范围后可以触发数据筛选
      this.filterData();
    },
    resetType() {
      this.selectedType = 0;
    },
    confirmType() {
      this.showTypePanel = false;
      // 更新交易类型后可以触发数据筛选
      this.filterData();
    },
    filterData() {
      // 这里可以添加筛选逻辑
      console.log('筛选条件：', { 
        selectedTime: this.selectedTime, 
        selectedType: this.selectedType,
        selectedApprovalProgress: this.selectedApprovalProgress,
        selectedTransactionProgress: this.selectedTransactionProgress
      });
    },
    // 更多筛选相关方法
    toggleFilterPanel() {
      this.showFilterPanel = !this.showFilterPanel;
      // 关闭其他可能打开的面板
      this.approvalProgressPanelVisible = false;
      this.transactionProgressPanelVisible = false;
    },
    toggleApprovalProgressPanel() {
      this.approvalProgressPanelVisible = !this.approvalProgressPanelVisible;
      if (this.approvalProgressPanelVisible) {
        this.transactionProgressPanelVisible = false;
      }
    },
    toggleTransactionProgressPanel() {
      this.transactionProgressPanelVisible = !this.transactionProgressPanelVisible;
      if (this.transactionProgressPanelVisible) {
        this.approvalProgressPanelVisible = false;
      }
    },
    selectApprovalProgress(option) {
      this.selectedApprovalProgress = option.value;
      this.approvalProgressPanelVisible = false;
    },
    selectTransactionProgress(option) {
      this.selectedTransactionProgress = option.value;
      this.transactionProgressPanelVisible = false;
    },
    resetFilter() {
      this.selectedApprovalProgress = 0;
      this.selectedTransactionProgress = 0;
    },
    confirmFilter() {
      this.showFilterPanel = false;
      this.filterData();
    },
    // 根据状态返回不同的标签类型
    getStatusType(status) {
      switch (status) {
        case 0: // 等待复核
          return 'warning';
        case 1: // 复核拒绝
          return 'danger';
        case 2: // 复核通过
          return 'success';
        default:
          return 'default';
      }
    }
  }
}
</script>

<style scoped>
.transaction-progress {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}



.header {
  padding: 10px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-bar {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
}

.filter-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 4px;
  background-color: #f5f5f5;
  font-size: 14px;
  margin-right: 10px;
}

.filter-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 20px;
}

/* 底部弹出选择器样式 */
.filter-popup-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 16px 16px 0 0;
}

.filter-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
  position: relative;
}

/* 底部弹出选择器的关闭按钮 */
.filter-popup-header .van-icon-close {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.filter-popup-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.filter-item {
  margin-bottom: 20px;
}

.filter-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.filter-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
}

.filter-option-item {
  padding: 18px 20px;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 1px solid #f5f5f5;
  text-align: center;
}

.filter-option-item:last-child {
  border-bottom: none;
}

.filter-option-item:hover {
  background-color: #fafafa;
}

.filter-option-item.active {
  color: #1989fa;
  font-weight: bold;
  background-color: #f5f9ff;
}

.filter-popup-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
}

.filter-dropdown span {
  margin-right: 5px;
}

.panel-content {
  padding: 15px;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.panel-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 列表内容 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

/* 记录项 */
.record-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-type {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.record-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.record-label {
  color: #999;
}

.record-value {
  color: #333;
}
</style>
