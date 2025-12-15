<template>
  <div class="filter-bar-container">
    <!-- 顶部筛选栏 -->
    <div class="filter-bar">
      <div class="filter-items">
        <!-- 前两个筛选项 -->
        <div 
          v-for="filter in displayFilters" 
          :key="filter.key"
          class="filter-item"
          :class="{ active: activeFilterKey === filter.key }"
          @click="toggleFilter(filter.key)"
        >
          <span class="filter-text">{{ getFilterText(filter) }}</span>
          <van-icon 
            :name="activeFilterKey === filter.key ? 'arrow-up' : 'arrow-down'" 
            class="filter-icon"
          />
        </div>
        
        <!-- 更多筛选图标 -->
        <div 
          v-if="showMoreIcon"
          class="filter-item more-filter"
          @click="showMorePanel = true"
        >
          <span class="filter-text">更多</span>
          <van-icon name="filter" class="filter-icon" />
        </div>
      </div>
    </div>
    
    <!-- 折叠面板内容 -->
    <div 
      v-if="activeFilterKey"
      class="filter-panel"
    >
      <!-- 时间范围筛选内容 -->
      <div v-if="activeFilterKey === 'time'" class="time-filter-content">
        <div class="panel-title">交易日期</div>
        <div class="button-group">
          <div 
            v-for="option in timeOptions" 
            :key="option.value"
            class="time-option"
            :class="{ active: selectedFilters.time === option.value }"
            @click="selectTime(option)"
          >
            <span>{{ option.text }}</span>
            <van-icon v-if="selectedFilters.time === option.value" name="success" class="check-icon" />
          </div>
        </div>
        <div class="panel-buttons">
          <van-button type="default" @click="resetTime" size="large">重置</van-button>
          <van-button type="primary" @click="confirmTime" size="large">确定</van-button>
        </div>
      </div>
      
      <!-- 交易类型筛选内容 -->
      <div v-if="activeFilterKey === 'type'" class="type-filter-content">
        <div class="panel-title">交易类型</div>
        <div class="type-options">
          <div 
            v-for="option in typeOptions" 
            :key="option.value"
            class="type-option"
            :class="{ active: selectedFilters.type === option.value }"
            @click="selectType(option)"
          >
            {{ option.text }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 更多筛选弹出层 -->
    <van-popup 
      v-model="showMorePanel" 
      position="right" 
      :style="{ width: '80%', height: '100%' }"
    >
      <div class="more-popup-content">
        <div class="popup-header">
          <h3>筛选条件</h3>
          <van-icon name="close" class="close-icon" @click="showMorePanel = false" />
        </div>
        <div class="popup-body">
          <!-- 审批进度筛选 -->
          <div class="popup-filter-item">
            <div class="filter-label">审批进度</div>
            <div class="filter-value" @click="showApprovalProgress = true">
              {{ getApprovalProgressText() }}
              <van-icon name="arrow" class="arrow-icon" />
            </div>
          </div>
          
          <!-- 交易进度筛选 -->
          <div class="popup-filter-item">
            <div class="filter-label">交易进度</div>
            <div class="filter-value" @click="showTransactionProgress = true">
              {{ getTransactionProgressText() }}
              <van-icon name="arrow" class="arrow-icon" />
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <van-button type="default" @click="resetMoreFilters" size="large">重置</van-button>
          <van-button type="primary" @click="confirmMoreFilters" size="large">确定</van-button>
        </div>
      </div>
      
      <!-- 审批进度下拉选择 -->
      <van-popup 
        v-model="showApprovalProgress" 
        position="bottom" 
        :style="{ height: '40%' }"
      >
        <div class="picker-content">
          <van-picker
            :columns="approvalProgressOptions"
            :default-index="getDefaultIndex(approvalProgressOptions, selectedFilters.approvalProgress)"
            ref="approvalPicker"
          />
          <div class="picker-footer">
            <span class="cancel-btn" @click="showApprovalProgress = false">取消</span>
            <span class="confirm-btn" @click="confirmApprovalProgress">确定</span>
          </div>
        </div>
      </van-popup>
      
      <!-- 交易进度下拉选择 -->
      <van-popup 
        v-model="showTransactionProgress" 
        position="bottom" 
        :style="{ height: '40%' }"
      >
        <div class="picker-content">
          <van-picker
            :columns="transactionProgressOptions"
            :default-index="getDefaultIndex(transactionProgressOptions, selectedFilters.transactionProgress)"
            ref="transactionPicker"
          />
          <div class="picker-footer">
            <span class="cancel-btn" @click="showTransactionProgress = false">取消</span>
            <span class="confirm-btn" @click="confirmTransactionProgress">确定</span>
          </div>
        </div>
      </van-popup>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon, Button, Picker } from 'vant'
import dayjs from 'dayjs'

export default {
  name: 'FilterBar',
  components: {
    VanPopup: Popup,
    VanIcon: Icon,
    VanButton: Button,
    VanPicker: Picker
  },
  props: {
    // 筛选配置项
    filters: {
      type: Array,
      default: () => []
    },
    // 初始选中的筛选值
    initialFilters: {
      type: Object,
      default: () => ({})
    },
    // 时间范围选项
    timeOptions: {
      type: Array,
      default: () => [
        { text: '最近一周', value: 'week' },
        { text: '最近一月', value: 'month' },
        { text: '最近三月', value: 'quarter' },
        { text: '最近一年', value: 'year' },
        { text: '最近三年', value: 'threeYears' }
      ]
    },
    // 交易类型选项
    typeOptions: {
      type: Array,
      default: () => [
        { text: '全部类型', value: 'all' },
        { text: '案款转出', value: 'transfer' },
        { text: '案款调账', value: 'adjust' },
        { text: '不明款认领', value: 'unclaimed' }
      ]
    },
    // 审批进度选项
    approvalProgressOptions: {
      type: Array,
      default: () => [
        { text: '全部', value: 'all' },
        { text: '复核通过', value: 'approved' },
        { text: '复核拒绝', value: 'rejected' },
        { text: '等待复核', value: 'pending' },
        { text: '取消', value: 'cancelled' }
      ]
    },
    // 交易进度选项
    transactionProgressOptions: {
      type: Array,
      default: () => [
        { text: '全部', value: 'all' },
        { text: '银行处理中', value: 'processing' },
        { text: '处理完成', value: 'completed' },
        { text: '处理失败', value: 'failed' }
      ]
    }
  },
  data() {
    return {
      // 响应式数据
      activeFilterKey: '', // 当前激活的筛选项
      showMorePanel: false, // 是否显示更多筛选面板
      showApprovalProgress: false, // 是否显示审批进度下拉
      showTransactionProgress: false, // 是否显示交易进度下拉
      
      // 临时存储选中值
      tempApprovalProgress: undefined,
      tempTransactionProgress: undefined,
      
      // 选中的筛选值
      selectedFilters: {
        time: 'week', // 时间范围：week, month, quarter, year, threeYears
        type: 'all', // 交易类型：all, transfer, adjust, unclaimed
        approvalProgress: 'all', // 审批进度：all, approved, rejected, pending
        transactionProgress: 'all' // 交易进度：all, processing, completed, failed
      }
    }
  },
  computed: {
    // 显示的筛选项（最多两个）
    displayFilters() {
      return this.filters.slice(0, 2)
    },
    
    // 是否显示更多图标
    showMoreIcon() {
      return this.filters.length > 2
    }
  },
  mounted() {
    // 初始化选中的筛选值
    Object.assign(this.selectedFilters, this.initialFilters)
  },
  methods: {
    // 获取筛选项显示文本
    getFilterText(filter) {
      switch (filter.key) {
        case 'time':
          return this.getTimeText()
        case 'type':
          return this.getTypeText()
        default:
          return filter.text
      }
    },
    
    // 获取时间范围显示文本
    getTimeText() {
      const option = this.timeOptions.find(opt => opt.value === this.selectedFilters.time)
      return option ? option.text : '最近一周'
    },
    
    // 获取交易类型显示文本
    getTypeText() {
      const option = this.typeOptions.find(opt => opt.value === this.selectedFilters.type)
      return option ? option.text : '全部类型'
    },
    
    // 获取审批进度显示文本
    getApprovalProgressText() {
      const option = this.approvalProgressOptions.find(opt => opt.value === this.selectedFilters.approvalProgress)
      return option ? option.text : '全部'
    },
    
    // 获取交易进度显示文本
    getTransactionProgressText() {
      const option = this.transactionProgressOptions.find(opt => opt.value === this.selectedFilters.transactionProgress)
      return option ? option.text : '全部'
    },
    
    // 切换筛选项
    toggleFilter(key) {
      this.activeFilterKey = this.activeFilterKey === key ? '' : key
    },
    
    // 选择时间范围
    selectTime(option) {
      this.selectedFilters.time = option.value
    },
    
    // 重置时间范围
    resetTime() {
      this.selectedFilters.time = 'week'
    },
    
    // 确认时间范围选择
    confirmTime() {
      this.activeFilterKey = ''
      this.emitFilterChange()
    },
    
    // 选择交易类型
    selectType(option) {
      this.selectedFilters.type = option.value
      this.activeFilterKey = ''
      this.emitFilterChange()
    },
    
    // 获取默认索引
    getDefaultIndex(options, value) {
      return options.findIndex(option => option.value === value)
    },
    
    // 确认审批进度
    confirmApprovalProgress() {
      // 使用ref直接获取Picker实例的当前值
      if (this.$refs.approvalPicker) {
        const selectedIndex = this.$refs.approvalPicker.getIndexes()[0];
        const selectedItem = this.approvalProgressOptions[selectedIndex];
        this.selectedFilters.approvalProgress = selectedItem.value;
        this.emitFilterChange();
      }
      this.showApprovalProgress = false;
    },
    
    // 确认交易进度
    confirmTransactionProgress() {
      // 使用ref直接获取Picker实例的当前值
      if (this.$refs.transactionPicker) {
        const selectedIndex = this.$refs.transactionPicker.getIndexes()[0];
        const selectedItem = this.transactionProgressOptions[selectedIndex];
        this.selectedFilters.transactionProgress = selectedItem.value;
        this.emitFilterChange();
      }
      this.showTransactionProgress = false;
    },
    
    // 重置更多筛选
    resetMoreFilters() {
      this.selectedFilters.approvalProgress = 'all'
      this.selectedFilters.transactionProgress = 'all'
    },
    
    // 确认更多筛选
    confirmMoreFilters() {
      this.showMorePanel = false
      this.emitFilterChange()
    },
    
    // 计算日期范围
    calculateDateRange() {
      const today = dayjs()
      let startDate
      
      // 根据选择的时间范围计算开始日期
      switch (this.selectedFilters.time) {
        case 'week':
          startDate = today.subtract(7, 'day')
          break
        case 'month':
          startDate = today.subtract(1, 'month')
          break
        case 'quarter':
          startDate = today.subtract(3, 'month')
          break
        case 'year':
          startDate = today.subtract(1, 'year')
          break
        case 'threeYears':
          startDate = today.subtract(3, 'year')
          break
        default:
          startDate = today.subtract(7, 'day')
      }
      
      // 格式化为YYYY-MM-DD格式
      return {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD')
      }
    },
    
    // 发出筛选变化事件
    emitFilterChange() {
      // 计算日期范围
      const dateRange = this.calculateDateRange()
      
      // 构建需要抛出的筛选值
      const filterData = {
        // 保留原始的时间范围值
        time: this.selectedFilters.time,
        // 添加计算后的日期范围
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        // 其他筛选条件保持不变
        type: this.selectedFilters.type,
        approvalProgress: this.selectedFilters.approvalProgress,
        transactionProgress: this.selectedFilters.transactionProgress
      }
      
      this.$emit('filter-change', filterData)
    }
  }
}
</script>

<style scoped>
.filter-bar-container {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-bar {
  /* padding: 10px 15px; */
}

.filter-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  margin-right: 8px;
}

.filter-item:last-child {
  margin-right: 0;
}

.filter-item.active {
  background-color: #e8f4ff;
  color: #1989fa;
}

.filter-text {
  font-size: 14px;
  margin-right: 4px;
}

.filter-icon {
  font-size: 12px;
  color: inherit;
}

.more-filter {
  background-color: transparent;
  padding: 8px 12px;
  flex: 0 0 auto;
}

.more-filter .filter-icon {
  color: #666;
}

/* 折叠面板样式 */
.filter-panel {
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.panel-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: flex-start;
}

/* 时间选项样式 */
.time-option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(25% - 7.5px);
  padding: 10px 5px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  font-size: 14px;
}

.time-option.active {
  color: #1989fa;
  background-color: #fff;
  border-color: #1989fa;
}

.time-option .check-icon {
  color: #1989fa;
  font-size: 16px;
}

/* 交易类型选项样式 */
.type-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-option {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-option.active {
  border-color: #1989fa;
  background-color: #e8f4ff;
  color: #1989fa;
}

/* 面板按钮样式 */
.panel-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

.panel-buttons .van-button {
  flex: 1;
  border-radius: 20px;
  height: 40px;
}

.panel-buttons .van-button--primary {
  background-color: #1989fa;
}

/* 更多筛选面板样式 */
.more-popup-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.popup-header .close-icon {
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.popup-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.popup-filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.popup-filter-item:last-child {
  border-bottom: none;
}

.filter-label {
  font-size: 16px;
  color: #333;
}

.filter-value {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

.arrow-icon {
  margin-left: 5px;
  font-size: 14px;
  color: #999;
}

.popup-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 20px;
}

.popup-footer .van-button {
  flex: 1;
  border-radius: 4px;
}

.popup-footer .van-button--primary {
  background-color: #1989fa;
}

/* Picker选择样式 */
.picker-content {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.picker-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #eee;
}

.cancel-btn, .confirm-btn {
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  color: #666;
}

.confirm-btn {
  color: #1989fa;
  font-weight: 500;
}
</style>