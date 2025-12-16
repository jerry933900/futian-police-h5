<template>
  <div class="filter-test">
    <h1>FilterBar 组件测试</h1>
    <filter-bar
      :filters="filterConfig"
      :initial-filters="initialFilters"
      :time-options="timeOptions"
      :type-options="typeOptions"
      :approval-progress-options="approvalProgressOptions"
      :transaction-progress-options="transactionProgressOptions"
      @filter-change="handleFilterChange"
    />
    <div class="filter-result">
      <h3>筛选结果:</h3>
      <pre>{{ selectedFilters }}</pre>
    </div>

    <!-- 审批意见列表（使用组件） -->
    <ApprovalSteps :approvalSteps="approvalSteps" :currentStep="currentStep" />
    
    <!-- 测试动态高亮的按钮 -->
    <div class="test-buttons">
      <button v-for="(step, index) in approvalSteps" :key="index" 
              @click="currentStep = index" 
              :class="{ 'active-btn': currentStep === index }">
        设置第{{ index + 1 }}步高亮 ({{ step.status }})
      </button>
    </div>
  </div>
</template>

<script>
import FilterBar from '@/components/FilterBar.vue'
import ApprovalSteps from '@/components/ApprovalSteps.vue'

export default {
  name: 'FilterTest',
  components: {
    FilterBar,
    ApprovalSteps
  },
  data() {
    return {
      // 筛选配置
      filterConfig: [
        { key: 'time', label: '交易日期' },
        { key: 'type', label: '交易类型' }
      ],
      // 初始筛选值
      initialFilters: {
        time: 'week',
        type: 'all'
      },
      // 选中的筛选值
      selectedFilters: {},
      // 时间范围选项
      timeOptions: [
        { text: '最近一周', value: 'week' },
        { text: '最近一月', value: 'month' },
        { text: '最近三月', value: 'quarter' },
        { text: '最近一年', value: 'year' },
        { text: '最近三年', value: 'threeYears' }
      ],
      // 交易类型选项
      typeOptions: [
        { text: '全部类型', value: 'all' },
        { text: '案款转出', value: 'transfer' },
        { text: '案款调账', value: 'adjust' },
        { text: '不明款认领', value: 'unclaimed' }
      ],
      // 审批进度选项
      approvalProgressOptions: [
        { text: '全部', value: 'all' },
        { text: '复核通过', value: 'approved' },
        { text: '等待复核', value: 'pending' },
        { text: '复核不通过', value: 'rejected' }
      ],
      // 交易进度选项
      transactionProgressOptions: [
        { text: '全部', value: 'all' },
        { text: '交易成功', value: 'success' },
        { text: '交易失败', value: 'failed' },
        { text: '交易中', value: 'processing' }
      ],
      // 当前高亮的步骤索引
      currentStep: 3,
      // 审批步骤数据
      approvalSteps: [
        {
          time: '2018-02-06',
          status: '同意',
          name: '张丽君',
          reason: ''
        },
        {
          time: '2018-02-07',
          status: '拒绝',
          name: '张丽君',
          reason: '拒绝原因：原因原因原因，原因原因原因原因原因原因原因，原因原因，原因原因原因原因'
        },
        {
          time: '',
          status: '待审批',
          name: '李审批',
          reason: ''
        },
        {
          time: '',
          status: '结束',
          name: '',
          reason: ''
        }
      ]
    }
  },
  methods: {
    // 处理筛选变化
    handleFilterChange(filters) {
      this.selectedFilters = filters
      console.log('筛选条件变化:', filters)
    }
  }
}
</script>

<style scoped>
.filter-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.filter-result {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 测试按钮样式 */
.test-buttons {
  margin-top: 30px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.test-buttons button {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.test-buttons button.active-btn {
  background-color: #1989fa;
  color: #ffffff;
}
</style>