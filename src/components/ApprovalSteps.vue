<template>
  <div class="approval-list">
    <h2 class="approval-title">审批意见列表</h2>
    <div class="steps-container">
      <div class="custom-steps">
        <div v-for="(step, index) in approvalSteps" :key="index" class="custom-step">
          <!-- 时间 -->
          <div class="step-time-container">
            <div class="step-time" v-if="step.status !== '待审批' && step.status !== '结束'">{{ step.time }}</div>
          </div>
          
          <!-- 步骤节点和连接线 -->
          <div class="step-line-container">
            <div class="step-circle" :class="{ 'active-circle': index <= currentStep, 'inactive-circle': index > currentStep }">
              <div class="step-icon">
                <!-- 根据状态显示不同图标 -->
                <span v-if="step.status === '同意' || step.status === '拒绝'">✓</span>
                <span v-else-if="step.status === '待审批'">...</span>
                <span v-else-if="step.status === '结束'">✓</span>
              </div>
            </div>
            <!-- 连接线 -->
            <div 
              class="step-line" 
              :class="{ 
                'active-line': index < currentStep, 
                'inactive-line': index >= currentStep,
                'step-line-with-reason': step.reason
              }"
              v-if="index < approvalSteps.length - 1"
            ></div>
          </div>
          
          <!-- 状态和姓名 -->
          <div class="step-status">
            <div class="status-text">{{ step.status }}</div>
            <div class="status-name" v-if="step.name">{{ step.name }}</div>
            <!-- 拒绝原因 -->
            <div class="status-reason" v-if="step.reason">{{ step.reason }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApprovalSteps',
  props: {
    approvalSteps: {
      type: Array,
      required: true,
      default: () => []
    },
    currentStep: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
/* 审批意见列表样式 */
.approval-list {
  margin-top: 40px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.approval-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30px;
  text-align: left;
}

.steps-container {
  position: relative;
  padding-left: 60px;
}

/* 自定义步骤条样式 */
.custom-steps {
  position: relative;
}

.custom-step {
  display: flex;
  align-items: flex-start;
  padding-bottom: 30px;
  position: relative;
}

/* 时间容器 - 保持布局一致性 */
.step-time-container {
  min-width: 80px;
  margin-right: 20px;
  padding-top: 2px;
}

/* 时间 */
.step-time {
  font-size: 14px;
  color: #666666;
}

/* 步骤节点和连接线容器 */
.step-line-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  position: relative;
}

/* 步骤节点 */
.step-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #1989fa;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  position: relative;
}

/* 未激活状态的节点 */
.inactive-circle {
  background-color: #e0e0e0;
}

/* 节点内的对勾图标 */
.step-icon {
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
}

/* 连接线 */
.step-line {
  width: 2px;
  height: 63px;
  position: absolute;
  left: 7px; /* 居中对齐节点 */
  top: 15px;
  transition: all 0.3s ease;
}

/* 有拒绝原因时的连接线样式 */
.step-line-with-reason {
  height: 189px;
}

/* 激活状态的连接线 */
.active-line {
  background-color: #1989fa;
}

/* 未激活状态的连接线 */
.inactive-line {
  background-color: #e0e0e0;
}

/* 状态和姓名 */
.step-status {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.status-text {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 5px;
}

.status-name {
  font-size: 14px;
  color: #666666;
}

/* 拒绝原因样式 */
.status-reason {
  font-size: 14px;
  color: #ff4444;
  margin-top: 8px;
  padding: 10px;
  background-color: #fff5f5;
  border-left: 3px solid #ff4444;
  border-radius: 4px;
  max-width: 400px;
  word-wrap: break-word;
  line-height: 1.4;
}

/* 最后一个步骤的样式调整 */
.custom-step:last-child {
  padding-bottom: 0;
}
</style>