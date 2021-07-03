<template>
  <el-dialog title="创建新的命名空间" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="命名空间" :label-width="formLabelWidth">
        <el-select v-model="form.namespace" placeholder="请选择命名空间">
          <el-option
            v-for="code in namespaceCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名单类型编码" :label-width="formLabelWidth">
        <el-select v-model="form.code" placeholder="请选择名单类型编码">
          <el-option
            v-for="code in listTypeCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="'字段[' + fieldName + ']'"
        :label-width="formLabelWidth"
        v-for="fieldName in fieldNameList"
        :key="fieldName"
      >
        <el-input
          v-model="form.fieldValueMap[fieldName]"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="form.description"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getListTypes } from "@/api/list-type";
export default {
  props: {
    namespaceCodeList: {
      type: Array,
      default: [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      formLabelWidth: "180px",
      listTypeMap: {},
      listTypeCodeList: [],
      fieldNameList: [],
      fieldValueMap: {},
    };
  },
  methods: {
    dialogChange() {
      switch (this.dialogType) {
        case "create":
          this.title = "创建新的名单项";
          this.show.id = false;
          this.disabled.id = true;
          this.disabled.namespace = false;
          this.disabled.code = false;
          this.disabled.fields = false;
          break;
        case "update":
          this.title = "修改名单项";
          this.show.id = true;
          this.disabled.id = true;
          this.disabled.namespace = true;
          this.disabled.code = true;
          this.disabled.fields = true;
        default:
          break;
      }
    },
    initData() {
      this.form.fields.forEach((element) => {
        this.fieldInfoList.push({
          value: element,
          label: element,
        });
      });
    },
    convertData(data) {
      let newData = _.clone(data);
      newData.is_valid = newData.is_valid === "true";
      return newData;
    },
    handleCreateListItem(data) {
      createListType(data).then((response) => {
        if (response.code === 0) {
          this.$message.success("创建成功!");
        }
      });
    },
    handleUpdateListItem(data) {
      updateListType(data.id, data).then((response) => {
        if (response.code === 0) {
          this.$message.success("更新成功!");
        }
      });
    },
    onSubmit() {
      let data = this.convertData(this.form);
      // console.log(`data: ${JSON.stringify(data)}`)
      switch (this.dialogType) {
        case "create":
          this.handleCreateListItem(data);
          break;
        case "update":
          this.handleUpdateListItem(data);
          break;
        default:
          break;
      }
      this.$emit("refreshTable");
      this.dialogFormVisible = false;
    },
  },
  watch: {
    dialogType() {
      this.dialogChange();
    },
  },
  created() {
    this.dialogChange();
  },
  computed: {
    dialogFormVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {
        this.$emit("closeDialog");
      },
    },
  },
  watch: {
    "form.namespace": async function () {
      this.listTypeCodeList = [];
      let req = { namespace: this.form.namespace };
      await getListTypes(req).then((response) => {
        let data = response.data;
        if (data == null) {
          return;
        }
        this.listTypeMap = {};
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          this.listTypeMap[element.code] = element;
          this.listTypeCodeList.push(element.code);
        }
      });
      console.log(`this.listTypeCodeList: ${JSON.stringify(this.listTypeCodeList)}`)
      if (this.listTypeCodeList != null && this.listTypeCodeList.length > 0) {
        this.form.code = this.listTypeCodeList[0];
      }
    },
    "form.code": function () {
      this.form.fieldValueMap = {};
      if (this.listTypeMap[this.form.code] != null) {
        this.fieldNameList = this.listTypeMap[this.form.code].fields;
        this.fieldNameList.forEach(function(value) {
          this.form.fieldValueMap[value] = "";
        })
      } else {
        this.fieldNameList = [];
      }
    },
  },
};
</script>