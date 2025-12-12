<template>
  <div class="review-auth">
    <div class="header">
      <!-- 使用新的FilterBar组件 -->
      <FilterBar 
        :filters="filterConfig" 
        :initial-filters="initialFilters"
        :time-options="timeOptions"
        :type-options="typeOptions"
        :approval-progress-options="approvalProgressOptions"
        :transaction-progress-options="transactionProgressOptions"
        @filter-change="handleFilterChange"
      />
    </div>
    
    <div class="content">
      <!-- 案件列表 -->
      <div class="record-item" v-for="(item, index) in items" :key="index">
        <div class="record-header">
          <span class="record-type">{{ item.type }}</span>
          <van-tag :type="getStatusType(item.status)" size="small">{{ item.statusText }}</van-tag>
        </div>
        <div class="record-body">
          <div class="record-row">
            <span class="record-label">案件类型</span>
            <span class="record-value">{{ item.type }}</span>
          </div>
          <div class="record-row">
            <span class="record-label">提交时间</span>
            <span class="record-value">{{ item.submitTime }}</span>
          </div>
          <div class="record-row">
            <span class="record-label">提交人</span>
            <span class="record-value">{{ item.submitter }}</span>
          </div>
          <div class="record-row">
            <span class="record-label">办案单位</span>
            <span class="record-value">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from '@/components/FilterBar.vue'

export default {
  name: 'ReviewAuth',
  components: {
    FilterBar
  },
  data() {
    return {
      // 筛选配置
      filterConfig: [
        { key: 'time', text: '最近一周' },
        { key: 'type', text: '交易类型' }
      ],
      // 初始筛选值
      initialFilters: {
        time: 'week',
        type: 'all',
        approvalProgress: 'all',
        transactionProgress: 'all'
      },
      // 时间范围选项（由父组件配置）
      timeOptions: [
        { text: '最近一周', value: 'week' },
        { text: '最近一月', value: 'month' },
        { text: '最近三月', value: 'quarter' },
        { text: '最近一年', value: 'year' },
        { text: '最近三年', value: 'threeYears' }
      ],
      // 交易类型选项（由父组件配置）
      typeOptions: [
        { text: '全部类型', value: 'all' },
        { text: '案款转出', value: 'transfer' },
        { text: '案款调账', value: 'adjust' },
        { text: '不明款认领', value: 'unclaimed' }
      ],
      // 审批进度选项（由父组件配置）
      approvalProgressOptions: [
        { text: '全部', value: 'all' },
        { text: '等待复核', value: 'pending' },
        { text: '复核通过', value: 'approved' },
        { text: '复核拒绝', value: 'rejected' },
        { text: '取消', value: 'cancelled' }
      ],
      // 交易进度选项（由父组件配置）
      transactionProgressOptions: [
        { text: '全部', value: 'all' },
        { text: '银行处理中', value: 'processing' },
        { text: '处理完成', value: 'completed' },
        { text: '处理失败', value: 'failed' }
      ],
      items: [
        {
          type: '案款转出',
          submitTime: '2025-12-01 15:29:26',
          submitter: '李某某',
          unit: '福田派出所',
          status: 0,
          statusText: '等待复核'
        },
        {
          type: '案款调账',
          submitTime: '2025-12-01 15:29:26',
          submitter: '李某某',
          unit: '福田派出所',
          status: 0,
          statusText: '等待复核'
        },
        {
          type: '不明款认领',
          submitTime: '2025-12-01 15:29:26',
          submitter: '李某某',
          unit: '福田派出所',
          status: 0,
          statusText: '等待复核'
        },
        {
          type: '案款转出',
          submitTime: '2025-12-01 15:29:26',
          submitter: '李某某',
          unit: '福田派出所',
          status: 0,
          statusText: '等待复核'
        }
      ]
    }
  },
  methods: {
    // 处理筛选变化事件
    handleFilterChange(filters) {
      console.log('筛选条件变化:', filters);
      // 在这里可以根据筛选条件更新数据
      this.filterData(filters);
    },
    
    // 筛选数据的方法
    filterData(filters) {
      // 根据筛选条件过滤数据的逻辑
      console.log('根据筛选条件过滤数据:', filters);
      // 这里可以根据实际需求实现数据过滤逻辑
      // 示例：根据时间范围和交易类型过滤items
      // this.filteredItems = this.items.filter(item => {
      //   // 根据filters.time和filters.type过滤
      // });
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
.review-auth {
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
  
  .filter-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-right: 10px;
  }
  
  .filter-collapse {
    width: 100%;
    display: flex;
    align-items: center;
  }
  
  .filter-dropdown {
    margin-right: 10px;
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
  
  /* 筛选弹窗样式 */
  .filter-popup-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
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
  
  .filter-popup-header h3 {
    margin: 0 auto;
    font-size: 16px;
    font-weight: bold;
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
    padding: 15px;
    cursor: pointer;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .filter-option-item:last-child {
    border-bottom: none;
  }
  
  .filter-option-item:hover {
    background-color: #f5f5f5;
  }
  
  .filter-option-item.active {
    color: #1989fa;
    font-weight: bold;
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
