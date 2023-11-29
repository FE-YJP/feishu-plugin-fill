<script setup>
import { bitable  } from "@lark-base-open/js-sdk"
import { reactive, onMounted } from "vue"
import { faker } from "@faker-js/faker/locale/zh_CN";
import { Message } from '@arco-design/web-vue';

let table = {}//当前表格

const state = reactive({
  fieldList:[],//表格字段
  typeList:[
    {
      name:'姓名',
      type:'username',
      type_num:1,
    },
    {
      name:"手机号",
      type:'phone',
      type_num:1,
    },
    {
      name:'邮箱',
      type:'email',
      type_num:1,
    },
    {
      name:'城市',
      type:'city',
      type_num:1,
    },
    {
      name:'数字',
      type:'number',
      type_num:2,
    },
    {
      name:'身份证号',
      type:'idcard',
      type_num:1,
    },
    {
      name:'银行卡号',
      type:'bankcard',
      type_num:1,
    },
    {
      name:'UUID',
      type:'uuid',
      type_num:1,
    },
    {
      name:'IP地址',
      type:'ip',
      type_num:1,
    },
    {
      name:'日期',
      type:'date',
      type_num:1,
    },
    {
      name:'图片',
      type:'image',
      type_num:1,
    },
    {
      name:'头像',
      type:'avatar',
      type_num:1,
    },
    {
      name:'颜色',
      type:'color',
      type_num:1,
    }
  ],//模拟类型列表
  type:'',//当前填充类型
  field:'',//当前填充字段
  fieldInfo:{},//当前字段属性
  typeInfo:{},//当前填充类型属性
  loading:false,//填充状态
  loadingField:false,//加载表格字段中
  num_min:1,//随机数字范围
  num_max:100,//随机数字范围
  showNumRange:false,//是否显示数字范围
  isInit:true,//是否是整数
  showDateRange:false,//显示事件范围选择
  dateRangeLeft:'',//时间范围
  dateRangeRight:'',//时间范围
})

// 获取当前表格数据
const getTable = async()=>{
  state.type = '',//当前填充类型
  state.field = '',//当前填充字段
  state.fieldInfo = {},//当前字段属性
  state.typeInfo = {},//当前填充类型属性
  state.num_min = 1,//随机数字范围
  state.num_max = 100,//随机数字范围
  state.showNumRange = false,//是否显示数字范围
  state.isInit = true;//是否是整数
  table = await bitable.base.getActiveTable();
  // const selection = await bitable.base.getSelection();
  // console.log("当前表格激活信息",selection)
  // const view = await table.getViewById(selection.viewId);
  // console.log("当前视图信息",view)
  // const fieldList = await table.getFieldList();
  // console.log("fieldList",fieldList)
  // 初始化字段列表
  getFieldList()
}

// 获取字段列表
const getFieldList = async()=>{
  state.loadingField = true
  // table = await bitable.base.getActiveTable();
  const fieldMetaList = await table.getFieldMetaList();

  state.fieldList = fieldMetaList.filter(item=>{
    // 文本/数字
    if(item.type == 1 || item.type == 2 ){
      return item
    }
  })
  state.loadingField = false
  console.log("fieldMetaList",fieldMetaList)
}


//获取字段属性
const getFieldInfo = (id) => {
  state.fieldList.forEach(item=>{
    if(item.id === id){
      state.fieldInfo = item
    }
  })
}

// 获取类型属性
const getTypeInfo = (type) => {
  state.typeList.forEach(item=>{
    if(item.type === type){
      state.typeInfo = item
    }
  })
  // 如果是数字类型，显示范围选择
  if(state.typeInfo.type_num == 2){
    state.showNumRange = true
  }else{
    state.showNumRange = false
  }
  // 如果是日期类型，显示范围选择
  if(state.typeInfo.type == 'date'){
    state.showDateRange = true
  }else{
    state.showDateRange = false
  }
}

onMounted(()=>{
  getTable()
})

const start = async()=>{
  console.log("state.type",state.type)
  if(!state.field){
    Message.error('请选择填充字段')
    return
  }
  if(!state.type){
    Message.error('请选择填充类型')
    return
  }
  // 判断字段类型和填充类型是否一致
  if(state.fieldInfo.type != state.typeInfo.type_num){
    Message.error('请保持字段类型和填充类型一致')
    return
  }
  try {
    state.loading = true
    // 获取记录
    const recordIdList = await table.getRecordIdList();
    switch(state.type){
      case 'username':
        fillName(recordIdList)
        break;
      case 'phone':
        fillPhone(recordIdList)
        break;
      case 'uuid':
        fillUuid(recordIdList)
        break;
      case 'email':
        fillEmail(recordIdList)
        break;
      case 'city':
        fillCity(recordIdList)
        break;
      case 'domain':
        fillDomain(recordIdList)
        break;
      case 'ip':
        fillIp(recordIdList)
        break;
      case 'image':
        fillImage(recordIdList)
        break;
      case 'avatar':
        fillAvatar(recordIdList)
        break;
      case 'color':
        fillColor(recordIdList)
        break;
      case 'number':
        fillNumber(recordIdList)
        break;
      case 'idcard':
        fillIdCard(recordIdList)
        break;
      case 'bankcard':
        fillBankCard(recordIdList)
        break;
      case 'date':
        fillDate(recordIdList)
        break;
    }
    state.loading = false
  } catch (error) {
    console.log(error)
    state.loading = false
  }
  
}

// 生成随机的银行卡号
const generateBankCardNumber = ()=>{
  // 银行卡号一般是16或19位数字
  const lengths = [16, 19];
  const cardNumberLength = lengths[Math.floor(Math.random() * lengths.length)];

  // 生成剩余数字部分
  const remainingDigits = Array.from({ length: cardNumberLength - 1 }, () => faker.number.int({ min: 0, max: 9 })).join('');

  // 计算校验位
  const checkDigit = calculateLuhnDigit('0' + remainingDigits);

  return '4' + remainingDigits + checkDigit; // 以'4'开头，模拟Visa卡号
}

// 计算 Luhn 算法的校验位
const calculateLuhnDigit = (cardNumber) =>{
  const digits = cardNumber.split('').map(Number);
  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let currentDigit = digits[i];

    if (alternate) {
      currentDigit *= 2;
      if (currentDigit > 9) {
        currentDigit -= 9;
      }
    }

    sum += currentDigit;
    alternate = !alternate;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return String(checkDigit);
}

// 生成并输出银行卡号
const fillBankCard = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: generateBankCardNumber()
    }
  })))
}



// 生成随机的身份证号码
const generateChinaIDCardNumber = ()=>{
  const addrCode = faker.helpers.replaceSymbolWithNumber('41######');
  const birthDate = faker.date.past(30, new Date(2000, 1, 1)).toISOString().slice(0, 10).replace(/-/g, '');
  const sequenceCode = faker.helpers.replaceSymbolWithNumber('###');
  const preIdCard = addrCode + birthDate + sequenceCode;
  const preIdCardArray = preIdCard.split('').map(Number);

  // 计算校验码
  const coefficientArray = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const verifyCodeArray = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += preIdCardArray[i] * coefficientArray[i];
  }

  const remainder = sum % 11;
  const verifyCode = verifyCodeArray[remainder];

  return preIdCard + verifyCode;
}

// 生成并输出身份证号码
const fillIdCard = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: generateChinaIDCardNumber()
    }
  })))
}
// 填充姓名
const fillName = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.person.fullName()
    }
  })))
}
// 填充手机号
const fillPhone = async(list)=>{
  const reg = faker.helpers.fromRegExp('1[3-9]#{9}')
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.phone.number(reg)
    }
  })))
}
// 填充uuid
const fillUuid = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.string.uuid()
    }
  })))
}
// 填充邮箱
const fillEmail = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.internet.email()
    }
  })))
}
// 填充城市
const fillCity = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.location.city()
    }
  })))
}
// 填充数字
const fillNumber = async(list)=>{
  await table.setRecords(list.map(id=>{
    // 根据当前字段类型的浮点数，计算填充的浮点数
    let formatter = state.fieldInfo.property.formatter
    let num = ''
    let precision = '0.1'
    // 如果是整数
    if(formatter === '0'){
      num = faker.number.int({ min: state.num_min, max: state.num_max }) 
      state.isInit = true
      // 如果是百分比小数
    }else if(formatter === '0.00%'){
      state.isInit = false
      precision = 0.01
      num = faker.number.float({ min: state.num_min, max: state.num_max, precision: precision })/100
      // 如果是百分比
    }else if(formatter === '0%'){
      state.isInit = true
      num = faker.number.int({ min: state.num_min, max: state.num_max }) / 100
    }else{
      // 小数
      state.isInit = false
      precision = Number(formatter + '1')
      console.log('小数',precision)
      num = faker.number.float({ min: state.num_min, max: state.num_max , precision: precision })
    }
    return {
      recordId: id,
      fields: {
        [state.field]: num
      }
    }
  }))
}

// IP
const fillIp = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.internet.ipv4()
    }
  })))
}
// 图片
const fillImage = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.image.url()
    }
  })))
}
// 头像
const fillAvatar = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]:`<img src="${faker.image.avatar()}">` 
    }
  })))
}
// 颜色
const fillColor = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: faker.color.rgb()
    }
  })))
}
// 日期
const fillDate = async(list)=>{
  await table.setRecords(list.map(id => ({
    recordId: id,
    fields: {
      [state.field]: new Date(faker.date.between({ from: state.dateRangeLeft, to: state.dateRangeRight })).toLocaleDateString()
    }
  })))
}

const onChange = (dateString, date)=>{
  console.log('onChange: ', dateString, date);
  state.dateRangeLeft = date[0]
  state.dateRangeRight = date[1]
}

</script>

<template>
  <a-space direction="vertical" size="middle">
    <a-space>
      <a-tooltip content="刷新（更新表格字段）">
        <a-button type="primary" @click="getTable">
          <template #icon>
            <icon-refresh color="red" />
          </template>
        </a-button>
      </a-tooltip>
      <a-space>
        <a-select placeholder="请选择填充字段" v-model="state.field" :loading="state.loadingField" @change="getFieldInfo">
          <a-option  v-for="(item,index) in state.fieldList" :key="index"  :value="item.id" :label="item.name"></a-option>
        </a-select>
      </a-space>
    </a-space>
    <a-select placeholder="请选择填充类型" v-model="state.type" @change="getTypeInfo">
      <a-option v-for="(item,index) in state.typeList" :key="index" :value="item.type" :label="item.name"></a-option>
    </a-select>
    <!-- 随机数字配置 -->
    <a-space v-if="state.showNumRange">
      <div class="tip">请输入最小值和最大值的范围</div>
    </a-space>
    <a-space v-if="state.showNumRange">
      <a-input-number v-model="state.num_min" placeholder="最小值"></a-input-number>
      <a-input-number v-model="state.num_max" placeholder="最大值"></a-input-number>
    </a-space>
    <a-space v-if="state.showNumRange">
      <div class="notice">提示：数字会根据字段类型自动匹配生成整数、小数还是百分比</div>
    </a-space>
    <a-space v-if="state.showDateRange">
      <a-range-picker
      showTime
      :time-picker-props="{
      defaultValue:['00:00:00','00:00:00']
      }"
      @change="onChange"
    />
    </a-space>
    
    <a-button type="primary" :loading="state.loading" @click="start">开始填充模拟数据</a-button>
    <a-space>
      <div class="notice">注意事项：暂只支持文本/数字字段,填充类型除数字外，皆为文本类型</div>
    </a-space>
 </a-space>
</template>

<style scoped>
.notice{
  color: red;
  font-size: 13px;
}
.tip{
  color: gray;
  font-size: 13px;
}
</style>