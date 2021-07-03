<template>
  <div class="app-container">
    <el-button
      type="primary"
      @click="handleDialogFormVisible = !handleDialogFormVisible"
    >
      新增名单项
    </el-button>
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="ID">
        <el-input v-model="form.id" placeholder="ID" clearable id="input_id" />
      </el-form-item>
      <el-form-item label="命名空间">
        <el-select v-model="form.namespace" placeholder="请选择命名空间">
          <el-option
            v-for="code in namespaceCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名单类型编码">
        <el-select v-model="form.code" placeholder="请选择名单类型编码">
          <el-option label="查询所有名单类型编码" value="" style="color: red">
          </el-option>
          <el-option
            v-for="code in listTypeCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否生效">
        <el-select v-model="form.is_valid" placeholder="请选择是否生效">
          <el-option label="全部" value=""></el-option>
          <el-option label="生效" value="true"></el-option>
          <el-option label="失效" value="false"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.description" placeholder="描述" clearable />
      </el-form-item>

      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="danger" icon="el-icon-delete"></el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @cell-dblclick="handleUpdateListType"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="ID" width="210" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="命名空间" width="200">
        <template slot-scope="scope">
          {{ scope.row.namespace }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="编码" width="200">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="'字段['+item+']'"
        width="200"
        v-for="item in fieldNameList"
        :key="item"
      >
        <template slot-scope="scope">
          {{ scope.row.fieldValueMap[item] }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否生效" width="200">
        <template slot-scope="scope">
          {{ scope.row.is_valid_str }}
        </template>
      </el-table-column>

      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template>
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableTotal"
      >
      </el-pagination>
    </div>
    <handle-item-dialog
      :visible.sync="handleDialogFormVisible"
      :fieldNameList.sync="fieldNameList"
      :namespaceCodeList.sync="namespaceCodeList"
      :listTypeCodeList.sync="listTypeCodeList"
      :form="selectData"
      @closeDialog="handleDialogFormVisible = false"
      @refreshTable="onSubmit"
    />
  </div>
</template>

<script>
import HandleItemDialog from "./handle-item-dialog";
import { getListTypeCodeList, getListTypes } from "@/api/list-type";
import { getNamespaceCodeList } from "@/api/namespace";
import { getListItems } from "@/api/list-item";

export default {
  components: {
    HandleItemDialog,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      form: {
        namespace: "",
        code: "",
      },
      selectData: this.newSelectData(),
      pageIndex: 1,
      pageSize: 10,
      tableTotal: 0,
      handleDialogFormVisible: false,
      formLabelWidth: "120px",
      namespaceCodeList: [],
      listTypeCodeList: [],
    };
  },
  async created() {
    this.namespaceCodeList = await getNamespaceCodeList();
    if (this.namespaceCodeList.length > 0) {
      this.form.namespace = this.namespaceCodeList[0];
    }
    if (this.form.namespace != "") {
      let params = { namespace: this.form.namespace };
      this.listTypeCodeList = await getListTypeCodeList(params);
      if (this.listTypeCodeList.length > 0) {
        this.form.code = this.listTypeCodeList[0];
      }
    }
    this.fetchData();
  },
  methods: {
    newSelectData() {
      return {
        "namespace": "",
        "code": ""
      }
    },
    convertData(data) {
      data.fieldValueMap = {};
      for (let k in data.multi_value) {
        data.fieldValueMap[k] = data.multi_value[k];
      }
      data.is_valid_str = data.is_valid ? "生效" : "失效";
    },
    async fetchData() {
      if (this.form.namespace === "") {
        return;
      }
      this.listLoading = true;

      await getListItems(this.form).then((response) => {
        if (response.code === 0) {
          this.list = response.data;
          if (this.list != null) {
            for (let index = 0; index < this.list.length; index++) {
              const element = this.list[index];
              this.convertData(element);
            }
          }
          this.tableTotal = response.total;
          this.listLoading = false;
        }
      });
    },
    onSubmit() {
      this.fetchData();
    },
    handleSizeChange() {
      this.fetchData();
    },
    handleCurrentChange() {
      this.fetchData();
    },
  },
  computed: {
    fieldNameList: {
      get() {
        getListTypes({code: this.form.code}).then(response => {
          let listType = response.data[0];
          if (listType) {
            return listType.fields;
          }
        });
        return [];
      }
    }
  }
};
</script>
