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
  </div>
</template>

<script>
import FilterBar from '@/components/FilterBar.vue'

export default {
  name: 'FilterTest',
  components: {
    FilterBar
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
  max-width: 600px;
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
</style>