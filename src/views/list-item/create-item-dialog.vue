<template>
  <el-dialog
    title="创建新的命名空间"
    :visible.sync="dialogFormVisible"
    :rules="validateRules"
  >
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
        :label="'字段[' + multiValue.field + ']'"
        :label-width="formLabelWidth"
        v-for="multiValue in form.multi_value"
        :key="multiValue.field"
      >
        <el-input v-model="multiValue.value" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否生效" :label-width="formLabelWidth">
        <el-select v-model="form.is_valid" placeholder="请选择是否生效">
          <el-option label="生效" value="true"></el-option>
          <el-option label="失效" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="业务额外属性[JSON]"
        :label-width="formLabelWidth"
        prop="extra"
      >
        <el-input
          type="textarea"
          v-model="form.extra"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getListTypes } from "@/api/list-type";
import { createListItem } from "@/api/list-item";
export default {
  props: {
    namespaceCodeList: {
      type: Array,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formLabelWidth: "180px",
      listTypeMap: {},
      listTypeCodeList: [],
      fieldNameList: [],
      multiValues: [],
      validateRules: {
        extra: [
          {
            require: false,
            message: "请输入业务额外属性",
            trigger: "blur",
            type: "object",
          },
        ],
      },
      form: this.initForm(),
    };
  },
  methods: {
    initForm() {
      return {
        namespace: "",
        code: "",
        extra: "{}",
        is_valid: "false",
        multi_value: [],
      };
    },
    dialogChange() {
      this.form = this.initForm();
      if (
        (this.form.namespace == undefined || this.form.namespace == "") &&
        this.namespaceCodeList != null &&
        this.namespaceCodeList.length > 0
      ) {
        this.form.namespace = this.namespaceCodeList[0];
      }
    },
    handleCreateListItem(data) {
      data.values = [];
      this.form.multi_value.forEach((element) => {
        data.values.push(element.value);
      });
      createListItem(data).then((response) => {
        if (response.code === 0) {
          this.$message.success("创建成功!");
        }
      });
    },
    onSubmit() {
      let data = _.clone(this.form);
      data.is_valid = data.is_valid == "true";
      data.extra = JSON.parse(data.extra);
      this.handleCreateListItem(data);
      this.$emit("refreshTable");
      this.dialogFormVisible = false;
    },
  },
  created() {},
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
      if (this.form.namespace == "") {
        return;
      }
      this.form.code = "";
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
      if (this.listTypeCodeList != null && this.listTypeCodeList.length > 0) {
        this.form.code = this.listTypeCodeList[0];
      }
    },
    "form.code": function () {
      if (this.form.code == "" || this.dialogType == "update") {
        return;
      }
      if (this.listTypeMap[this.form.code] != null) {
        this.form.multi_value = [];
        this.fieldNameList = this.listTypeMap[this.form.code].fields;
        this.fieldNameList.forEach((element) => {
          this.form.multi_value.push({ field: element, value: "" });
        });
      } else {
        this.fieldNameList = [];
      }
    },
    visible: function () {
      this.dialogChange();
    },
  },
};
</script>