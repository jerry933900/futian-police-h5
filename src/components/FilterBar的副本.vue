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
        :style="{ height: '30%' }"
      >
        <div class="dropdown-content">
          <div 
            v-for="option in approvalProgressOptions" 
            :key="option.value"
            class="dropdown-option"
            :class="{ active: selectedFilters.approvalProgress === option.value }"
            @click="selectApprovalProgress(option)"
          >
            {{ option.text }}
          </div>
        </div>
      </van-popup>
      
      <!-- 交易进度下拉选择 -->
      <van-popup 
        v-model="showTransactionProgress" 
        position="bottom" 
        :style="{ height: '30%' }"
      >
        <div class="dropdown-content">
          <div 
            v-for="option in transactionProgressOptions" 
            :key="option.value"
            class="dropdown-option"
            :class="{ active: selectedFilters.transactionProgress === option.value }"
            @click="selectTransactionProgress(option)"
          >
            {{ option.text }}
          </div>
        </div>
      </van-popup>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon, Button } from 'vant'

export default {
  name: 'FilterBar',
  components: {
    VanPopup: Popup,
    VanIcon: Icon,
    VanButton: Button
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
    
    // 选择审批进度
    selectApprovalProgress(option) {
      this.selectedFilters.approvalProgress = option.value
      this.showApprovalProgress = false
    },
    
    // 选择交易进度
    selectTransactionProgress(option) {
      this.selectedFilters.transactionProgress = option.value
      this.showTransactionProgress = false
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
    
    // 发出筛选变化事件
    emitFilterChange() {
      this.$emit('filter-change', this.selectedFilters)
    }
  }
}
</script>

<style lang="scss" scoped>
// 颜色变量
$primary-color: #1989fa;
$white: #fff;
$light-gray: #f5f5f5;
$border-gray: #eee;
$text-primary: #333;
$text-secondary: #666;
$text-tertiary: #999;
$border-light: #e0e0e0;
$light-blue-bg: #e8f4ff;

// 混合宏
@mixin transition($property: all, $duration: 0.3s, $timing: ease) {
  transition: $property $duration $timing;
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin filter-item-base {
  @include flex-center;
  padding: 8px 12px;
  background-color: $light-gray;
  border-radius: 4px;
  cursor: pointer;
  @include transition;
  flex: 1;
  margin-right: 8px;
  
  &:last-child {
    margin-right: 0;
  }
  
  &.active {
    background-color: $light-blue-bg;
    color: $primary-color;
  }
}

@mixin option-base {
  padding: 12px;
  border: 1px solid $border-light;
  border-radius: 4px;
  cursor: pointer;
  @include transition;
  
  &.active {
    border-color: $primary-color;
    color: $primary-color;
  }
}

// 主容器样式
.filter-bar-container {
  width: 100%;
  background-color: $white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  // 顶部筛选栏
  .filter-bar {
    padding: 10px 15px;
    
    .filter-items {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .filter-item {
        @include filter-item-base;
        
        .filter-text {
          font-size: 14px;
          margin-right: 4px;
        }
        
        .filter-icon {
          font-size: 12px;
          color: inherit;
        }
        
        &.more-filter {
          background-color: transparent;
          flex: 0 0 auto;
          
          .filter-icon {
            color: $text-secondary;
          }
        }
      }
    }
  }
  
  // 折叠面板内容
  .filter-panel {
    background-color: $white;
    border-top: 1px solid $border-gray;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    .panel-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 15px;
      color: $text-primary;
    }
    
    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      justify-content: flex-start;
    }
    
    // 时间范围筛选内容
    &.time-filter-content {
      .time-option {
        position: relative;
        @include flex-center;
        width: calc(25% - 7.5px);
        padding: 10px 5px;
        border: 1px solid $border-light;
        border-radius: 4px;
        cursor: pointer;
        @include transition;
        background-color: $white;
        font-size: 14px;
        
        &.active {
          color: $primary-color;
          background-color: $white;
          border-color: $primary-color;
          
          .check-icon {
            color: $primary-color;
            font-size: 16px;
          }
        }
      }
    }
    
    // 交易类型筛选内容
    &.type-filter-content {
      .type-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        
        .type-option {
          @include option-base;
          
          &.active {
            background-color: $light-blue-bg;
          }
        }
      }
    }
    
    // 面板按钮
    .panel-buttons {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 20px;
      
      .van-button {
        flex: 1;
        border-radius: 20px;
        height: 40px;
        
        &--primary {
          background-color: $primary-color;
        }
      }
    }
  }
}

// 更多筛选弹出层
.more-popup-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $white;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid $border-gray;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    .close-icon {
      font-size: 20px;
      color: $text-tertiary;
      cursor: pointer;
    }
  }
  
  .popup-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
    .popup-filter-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid $border-gray;
      
      &:last-child {
        border-bottom: none;
      }
      
      .filter-label {
        font-size: 16px;
        color: $text-primary;
      }
      
      .filter-value {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: $text-secondary;
        cursor: pointer;
        
        .arrow-icon {
          margin-left: 5px;
          font-size: 14px;
          color: $text-tertiary;
        }
      }
    }
  }
  
  .popup-footer {
    padding: 20px;
    border-top: 1px solid $border-gray;
    display: flex;
    gap: 20px;
    
    .van-button {
      flex: 1;
      border-radius: 4px;
      
      &--primary {
        background-color: $primary-color;
      }
    }
  }
}

// 下拉选择样式
.dropdown-content {
  height: 100%;
  background-color: $white;
  padding: 10px;
  overflow-y: auto;
  
  .dropdown-option {
    padding: 15px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    @include transition;
    
    &.active {
      color: $primary-color;
      font-weight: 500;
    }
  }
}
</style>