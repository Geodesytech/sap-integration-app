define([
  "dojo/_base/declare",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/_base/lang",
  "dojo/_base/html",
  "dojo/_base/array",
  "jimu/LayerInfos/LayerInfos",
  "dojo/on",
  "jimu/BaseWidget",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "esri/graphic",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "dojo/parser",
  "dojo/dom",
  "dijit/registry",
  "dijit/ConfirmDialog",
  "dijit/form/Button",
  "dijit/form/TextBox",
  "dijit/form/ValidationTextBox",
  "dijit/Tooltip",
  "dijit/form/Select",
  "dojo/data/ObjectStore",
  "dojo/store/Memory",
  "dijit/form/FilteringSelect",
  "dijit/Fieldset",
  "dojo/dom-style",
  "dojox/layout/TableContainer",
  "dojo/request",
  "dojo/domReady!",
], function (
  declare,
  _WidgetsInTemplateMixin,
  lang,
  html,
  array,
  LayerInfos,
  on,
  BaseWidget,
  FeatureLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  Color,
  Graphic,
  Query,
  QueryTask,
  parser,
  dom,
  registry,
  ConfirmDialog,
  Button,
  TextBox,
  ValidationTextBox,
  Tooltip,
  Select,
  ObjectStore,
  Memory,
  FilteringSelect,
  Fieldset,
  domStyle,
  TableContainer,
  request
) {
  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    baseClass: "jimu-widget-sap",
    getRnRInfoService: "https://127.0.0.1/rnr/",
    getGovInfoService: "https://127.0.0.1/govt/",
    getFraInfoService: "https://127.0.0.1/fra/",
    postInitRnRService: "https://127.0.0.1/init/rnr/",
    postInitGovService: "https://127.0.0.1/init/govt/",
    postInitFraService: "https://127.0.0.1/init/fra/",
    postRnRService: "https://127.0.0.1/payment/rnr/",
    postGovService: "https://127.0.0.1/payment/govt/",
    postFraService: "https://127.0.0.1/payment/fra/",
    getPaymentHistoryService: "https://127.0.0.1/payment/history/rnr/",
    parsaMap:
      "https://services6.arcgis.com/47C7YqOiFYQ4nST3/arcgis/rest/services/parsa_land_info/FeatureServer/0",
    highlightGraphic: {},
    updateFeature: null,
    parcelLayer: null,
    componentsPanelList: [
      "private-panel",
      "forest-panel",
      "govt-panel",
      "init-pay-container",
    ],
    rnrList: [],
    govtList: [],
    fraList: [],
    sapList: [],
    masterFields: [
      "check_list",
      "fiscal_year",
      "company_code",
      "sp_g_l",
      "witholding_tax_code",
      "business_area",
      "tax_code",
      "business_place",
      "section_code",
      "profit_center",
      "assignment",
      "bank_partner_type",
      "doc_sub_category",
      "witholding_tax_code",
    ],
    privateFields: [
      "pay_cost_unit",
      "pay_cost_plot",
      "pay_cost_lieu",
      "grant_dis_fam",
      "grant_scst_fam",
      "tran_cost_fam",
      "pay_cattle_sh",
      "grant_art_trader",
      "settle_allow",
      "fee_stamp_duty",
      "pay_cost_unit_wbs",
      "pay_cost_plot_wbs",
      "pay_cost_lieu_wbs",
      "grant_dis_fam_wbs",
      "grant_scst_fam_wbs",
      "tran_cost_fam_wbs",
      "pay_cattle_sh_wbs",
      "grant_art_trader_wbs",
      "settle_allow_wbs",
      "fee_stamp_duty_wbs",
      "land_compn",
      "assets_com",
      "tree_com",
      "land_compn_wbs",
      "assets_com_wbs",
      "tree_com_wbs",
    ],
    rnrWbs: [
      "land_compn_p",
      "assets_com_p",
      "tree_com_p",
      "interest",
      "pay_cost_unit",
      "pay_cost_plot",
      "pay_cost_lieu",
      "grant_dis_fam",
      "grant_scst_fam",
      "tran_cost_fam",
      "pay_cattle_sh",
      "grant_art_trader",
      "settle_allow",
      "fee_stamp_duty",
      "pay_cost_unit_wbs",
      "pay_cost_plot_wbs",
      "pay_cost_lieu_wbs",
      "grant_dis_fam_wbs",
      "grant_scst_fam_wbs",
      "tran_cost_fam_wbs",
      "pay_cattle_sh_wbs",
      "grant_art_trader_wbs",
      "settle_allow_wbs",
      "fee_stamp_duty_wbs",
      "land_compn_p_wbs",
      "assets_com_p_wbs",
      "tree_com_p_wbs",
      "interest_wbs",
    ],
    initPrivateFields: [
      "init_pay_cost_unit",
      "init_pay_cost_plot",
      "init_pay_cost_lieu",
      "init_grant_dis_fam",
      "init_grant_scst_fam",
      "init_tran_cost_fam",
      "init_pay_cattle_sh",
      "init_grant_art_trader",
      "init_settle_allow",
      "init_fee_stamp_duty",
      "init_pvt_land_compn",
      "init_pvt_assets_com",
      "init_pvt_tree_com",
      "init_pvt_land_wbs",
      "init_pvt_asset_wbs",
      "init_pvt_tree_wbs",
    ],
    forestFields: [
      "land_compn_f",
      "assets_com_f",
      "tree_com_f",
      "pay_npv",
      "pay_safety_zn",
      "amt_wlmp",
      "amt_ca_scheme",
      "pay_gap_smc",
      "pay_tree_fel",
      "pay_npv_wbs",
      "pay_safety_zn_wbs",
      "amt_wlmp_wbs",
      "amt_ca_scheme_wbs",
      "pay_gap_smc_wbs",
      "pay_tree_fel_wbs",
      "land_compn_f_wbs",
      "assets_com_f_wbs",
      "tree_com_f_wbs",
    ],
    govFields: [
      "pay_premium",
      "pay_lease_rent_an",
      "pay_assets",
      "pay_ench_gov_lnd",
      "pay_ench_forest_lnd",
      "pay_premium_wbs",
      "pay_lease_rent_an_wbs",
      "pay_assets_wbs",
      "pay_ench_gov_lnd_wbs",
      "pay_ench_forest_lnd_wbs",
    ],
    landType: null,
    wbsList: [
      { id: "Please Select WBS", label: "Please Select WBS" },
      { id: "P-1000-01", label: "P-1000-01" },
      { id: "P-1000-02", label: "P-1000-02" },
      { id: "P-1000-03", label: "P-1000-03" },
      { id: "P-1000-04", label: "P-1000-04" },
      { id: "P-1000-05", label: "P-1000-05" },
      { id: "P-1000-06", label: "P-1000-06" },
      { id: "P-1000-07", label: "P-1000-07" },
      { id: "P-1000-08", label: "P-1000-08" },
      { id: "P-1000-09", label: "P-1000-09" },
      { id: "P-1000-10", label: "P-1000-10" },
      { id: "P-1000-11", label: "P-1000-11" },
      { id: "P-1000-12", label: "P-1000-12" },
      { id: "P-1000-13", label: "P-1000-13" },
      { id: "P-1000-14", label: "P-1000-14" },
      { id: "P-1000-15", label: "P-1000-15" },
      { id: "P-1000-16", label: "P-1000-16" },
      { id: "P-1000-17", label: "P-1000-17" },
      { id: "P-1000-18", label: "P-1000-18" },
      { id: "P-1000-19", label: "P-1000-19" },
      { id: "P-1000-20", label: "P-1000-20" },
      { id: "P-1000-21", label: "P-1000-21" },
      { id: "P-1000-22", label: "P-1000-22" },
      { id: "P-1000-23", label: "P-1000-23" },
      { id: "P-1000-24", label: "P-1000-24" },
      { id: "P-1000-25", label: "P-1000-25" },
      { id: "P-1000-26", label: "P-1000-26" },
      { id: "P-1000-27", label: "P-1000-27" },
      { id: "P-1000-28", label: "P-1000-28" },
      { id: "P-1000-29", label: "P-1000-29" },
      { id: "P-1000-30", label: "P-1000-30" },
      { id: "P-1000-31", label: "P-1000-31" },
      { id: "P-1000-32", label: "P-1000-32" },
      { id: "P-1000-33", label: "P-1000-33" },
      { id: "P-1000-34", label: "P-1000-34" },
      { id: "P-1000-35", label: "P-1000-35" },
      { id: "P-1000-36", label: "P-1000-36" },
    ],
    wbsElements: {},
    parcel_id: null,
    owner_id: null,

    startup: function () {
      this.inherited(arguments);
      parser.parse();

      this._setInitWBSUI();
      this._confirmPopup();
      this._updateInitPvt();
      this._updateInitGovt();
      this._updateInitFra();
      this.registerRnRAmt();
      this.registerGovtAmt();
      this.registerFraAmt();
      this._govPaymentUpdate();
      this._fraPaymentUpdate();
      this._rnrPaymentUpdate();

      this.parcelLayer = this.map.getLayer(
        this._getLayerID(this.map, "ParsaLandInfo")
      );
      var highlightSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([255, 0, 0]),
          3
        ),
        new Color([125, 125, 125, 0.35])
      );
      this.parcelLayer.on(
        "click",
        lang.hitch(this, function (evt) {
          this.restForm();
          this.landType = evt.graphic.attributes.land_b.toLowerCase();
          this.parcel_id = evt.graphic.attributes.parcel_id;
          this.project_id = evt.graphic.attributes.project_id;
          this.setParcelInfo(evt.graphic.attributes);
          if (this.landType === "private") {
            this.getRnRInfo(this.project_id, this.parcel_id);
          } else if (this.landType === "govt") {
            this.getGovInfo(this.project_id, this.parcel_id);
          } else {
            this.getFraInfo(this.project_id, this.parcel_id);
          }

          if (this.highlightGraphic) this.map.graphics.clear();
          this.highlightGraphic = new Graphic(
            evt.graphic.geometry,
            highlightSymbol
          );
          this.map.graphics.add(this.highlightGraphic);
          this.updateFeature = evt.graphic;
        })
      );
    },
    _getLayerID: function (map, layerTitle) {
      //local function to fetch the LayerID of layer in the map
      var layerID;
      LayerInfos.getInstance(map, map.itemInfo).then(
        lang.hitch(function (operLayerInfos) {
          operLayerInfos.traversal(function (layerInfo) {
            if (layerInfo.title == layerTitle) {
              // console.log(layerInfo);
              layerID = layerInfo.id;
            }
          });
        })
      );
      return layerID;
    },
    _confirmPopup: function () {
      var confirmPopup = new ConfirmDialog({
        title: "Raise Payment",
        content: "Do you want to continue?",
        style: "width: 300px",
      });
      confirmPopup.set("buttonOk", "Yes");
      confirmPopup.set("buttonCancel", "No");
      return confirmPopup;
    },
    _updateInitPvt: function () {
      var popup = this._confirmPopup();
      // show
      on(
        this.initPvtUpdate,
        "click",
        lang.hitch(this, function () {
          popup.show();
          console.log("alertUser", "I am alerting you.");
          // console.log(this.updateFeature);
        })
      );

      // register events
      popup.on(
        "execute",
        lang.hitch(this, function () {
          let featureAttributes = {};
          for (let index = 0; index < this.rnrWbs.length; index++) {
            let element = `init_${this.rnrWbs[index]}`;
            if (this.isValEmpty(dom.byId(element).value)) {
              console.log(dom.byId(element).value, element);
              alert("Please fill the requred details");
              return;
            }
            let val = parseFloat(dom.byId(element).value.replace(/,/g, ""));
            featureAttributes[element] = val;
          }
          let initAttributes = {
            ...featureAttributes,
            ...this.wbsElements,
            parcel_id: this.parcel_id,
          };
          console.log(initAttributes);
          this.postRequiredRnR(initAttributes);
        })
      );
      popup.on("cancel", function () {
        alert("Bye");
      });
    },

    calculateComponentAmt: function (lType, cType) {
      let total = 0;
      let rnrTotal = 0;
      var compensation = [
        `land_compn_${cType}`,
        `assets_com_${cType}`,
        `tree_com_${cType}`,
        "interest",
      ];
      this.rnrWbs.map((rnr, i) => {
        let condition = rnr.split("_").indexOf("wbs") < 0;
        if (condition && compensation.indexOf(rnr) >= 0) {
          var val = dom.byId(`init_${rnr}`).value.replace(/,/g, "");
          total += parseFloat(val ? val : 0);
        } else if (condition && compensation.indexOf(rnr) < 0) {
          var val = dom.byId(`init_${rnr}`).value.replace(/,/g, "");
          rnrTotal += parseFloat(val ? val : 0);
        }
      });
      //pvt
      dom.byId(`init_${lType}_total_com`).value = total + rnrTotal;
      dom.byId(`init_${lType}_rnr_com`).value = rnrTotal;
    },
    _setInitRnRUI: function () {
      this.ownerListContainer.style.display = "none";
      for (let index = 0; index < this.rnrWbs.length; index++) {
        var ele = `init_${this.rnrWbs[index]}`;
        if (ele.split("_").indexOf("wbs") < 0) {
          on(
            dijit.byId(ele),
            "change",
            lang.hitch(this, function () {
              console.log("---calculateComponentAmt");
              this.calculateComponentAmt("pvt", "p");
            })
          );
        }
      }
    },
    _setRnRUI: function (ownersList) {
      this.ownerListContainer.style.display = "inline-block";
      var ownerStore = new Memory({
        idProperty: "owner_name",
        data: ownersList,
      });

      this.ownerNamesList.set("store", ownerStore);
    },
    _onParamChange: function () {
      console.log(this.ownerNamesList.item.percentage);
      let newPercentage = 0;
      let exField = [];
      if (this.ownerNamesList.item.exception) {
        exField = this.ownerNamesList.item.ex_fields.split(";");
        newPercentage = parseFloat(exField[0]) / 100;
      }
      var percentage = this.ownerNamesList.item.percentage / 100;
      this.owner_id = this.ownerNamesList.item.owner_id;
      this.getPaymentHistory(
        this.ownerNamesList.item.parcel_id,
        this.ownerNamesList.item.owner_id
      );
      this.rnrWbs.map((wbs, i) => {
        if (typeof this.rnrList[0][wbs] === "number") {
          if (exField.indexOf(wbs) > -1) {
            dom.byId(wbs).value = (
              this.rnrList[0][wbs] * newPercentage
            ).toFixed(2);
          } else {
            dom.byId(wbs).value = (this.rnrList[0][wbs] * percentage).toFixed(
              2
            );
          }
        } else {
          dom.byId(wbs).value = this.rnrList[0][wbs];
        }
      });
    },
    _setInitWBSUI: function () {
      var wbsStore = new Memory({ data: this.wbsList });

      var wbsObjStore = new ObjectStore({ objectStore: wbsStore });

      var wbsIdLst = [
        "init_land_compn_p_wbs",
        "init_assets_com_p_wbs",
        "init_tree_com_p_wbs",
        "init_interest_wbs",
        "init_pay_cost_unit_wbs",
        "init_pay_cost_plot_wbs",
        "init_pay_cost_lieu_wbs",
        "init_grant_dis_fam_wbs",
        "init_grant_scst_fam_wbs",
        "init_tran_cost_fam_wbs",
        "init_pay_cattle_sh_wbs",
        "init_grant_art_trader_wbs",
        "init_settle_allow_wbs",
        "init_fee_stamp_duty_wbs",
        "init_pay_npv_wbs",
        "init_pay_safety_zn_wbs",
        "init_amt_wlmp_wbs",
        "init_amt_ca_scheme_wbs",
        "init_pay_gap_smc_wbs",
        "init_fra_asset_wbs",
        "init_pay_tree_fel_wbs",
        "init_land_compn_f_wbs",
        "init_assets_com_f_wbs",
        "init_tree_com_f_wbs",
        "init_pay_premium_wbs",
        "init_pay_lease_rent_an_wbs",
        "init_pay_assets_wbs",
        "init_pay_ench_gov_lnd_wbs",
        "init_pay_ench_forest_lnd_wbs",
      ];
      for (let index = 0; index < wbsIdLst.length; index++) {
        let element = wbsIdLst[index];
        let wbsSelect = new FilteringSelect(
          { store: wbsObjStore, searchAttr: "id", value: "Please Select WBS" },
          element
        );
        wbsSelect.startup();
        wbsSelect.on(
          "change",
          lang.hitch(this, function (evt) {
            this.wbsElements[element] = evt;
          })
        );
      }
    },
    _setSAPUI: function (SAPList) {
      dom.byId("master-panel").style.display = "inline-block";
      for (let index = 0; index < this.masterFields.length; index++) {
        var master = this.masterFields[index];
        dom.byId(master).value = SAPList[0][master];
      }
    },

    _setOwnerInfo: function (ownerList) {
      console.log(ownerList);
      let ownerUi = "";
      for (let index = 0; index < ownerList.length; index++) {
        ownerUi += `<tr>
                        <td style="width: 5rem;">${index + 1}</td>
                        <td>${ownerList[index]["owner_name"]}</td>
                        <td style="width: 5rem;">${
                          ownerList[index]["percentage"]
                        }%</td>
                      </tr>`;
      }
      dom.byId("owner-container").innerHTML = `<table>
                    <caption>Owner Summary</caption>
                      <tr>
                        <th>SN</th>
                        <th>Owner Name</th>
                        <th>Per%</th>
                      </tr>${ownerUi}
                    </table>`;
    },
    registerRnRAmt: function () {
      this.rnrWbs.map((pay_history, i) => {
        if (pay_history.split("_").indexOf("wbs") < 0) {
          dijit.byId(`pvt_${pay_history}`).validator = function (
            value,
            constraints
          ) {
            // Check
            if (
              parseFloat(
                dojo.byId(`pending_${pay_history}`).value.replace(/,/g, "")
              ) >= parseFloat(value.replace(/,/g, ""))
            ) {
              return true;
            } else {
              return false;
            }
          };
        }
      });
    },
    registerGovtAmt: function () {
      this.govFields.map((pay_history, i) => {
        if (pay_history.split("_").indexOf("wbs") < 0) {
          dijit.byId(`govt_${pay_history}`).validator = function (
            value,
            constraints
          ) {
            // Check
            if (
              parseFloat(
                dojo.byId(`pending_${pay_history}`).value.replace(/,/g, "")
              ) >= parseFloat(value.replace(/,/g, ""))
            ) {
              return true;
            } else {
              return false;
            }
          };
        }
      });
    },
    registerFraAmt: function () {
      this.forestFields.map((pay_history, i) => {
        if (pay_history.split("_").indexOf("wbs") < 0) {
          dijit.byId(`fra_${pay_history}`).validator = function (
            value,
            constraints
          ) {
            // Check
            if (
              parseFloat(
                dojo.byId(`pending_${pay_history}`).value.replace(/,/g, "")
              ) >= parseFloat(value.replace(/,/g, ""))
            ) {
              return true;
            } else {
              return false;
            }
          };
        }
      });
    },
    _setRegisterFra: function (status, paymentHistory) {
      this.forestFields.map((wbs, i) => {
        if (typeof this.fraList[0][wbs] === "number") {
          dom.byId(wbs).value = this.fraList[0][wbs].toFixed(2);

          var paid = isNaN(parseFloat(paymentHistory[wbs]).toFixed(2))
            ? 0
            : parseFloat(paymentHistory[wbs]).toFixed(2);

          dom.byId(`pending_${wbs}`).value =
            parseFloat(dom.byId(wbs).value.replace(/,/g, "")).toFixed(2) - paid;
        } else {
          dom.byId(wbs).value = this.fraList[0][wbs];
        }
      });
    },
    _setRegisterGovt: function (status, paymentHistory) {
      this.govFields.map((wbs, i) => {
        if (typeof this.govtList[0][wbs] === "number") {
          dom.byId(wbs).value = this.govtList[0][wbs].toFixed(2);

          var paid = isNaN(parseFloat(paymentHistory[wbs]).toFixed(2))
            ? 0
            : parseFloat(paymentHistory[wbs]).toFixed(2);

          dom.byId(`pending_${wbs}`).value =
            parseFloat(dom.byId(wbs).value.replace(/,/g, "")).toFixed(2) - paid;
        } else {
          dom.byId(wbs).value = this.govtList[0][wbs];
        }
      });
      var d = new Date(this.govtList[0]["lease_duedate"])
        .toDateString()
        .split(" ");
      dom.byId("lease_duedate").value = `${d[2]}-${d[1]}-${d[3]}`;
    },
    setParcelInfo: function (parcelInfo) {
      let parcelList = [
        "survey_no",
        "village",
        "taluk",
        "district",
        "state",
        "land_b",
        "Shape__Area",
      ];

      dom.byId("parcel_info").style.display = "inherit";
      for (let index = 0; index < parcelList.length; index++) {
        var parcel = parcelList[index];
        dom.byId(parcel).innerHTML = parcelInfo[parcel];
      }
    },
    setPaymentInfo: function (totalComp) {
      dom.byId("payment_panel").style.display = "inherit";
      dom.byId("total_com").innerHTML = totalComp["totalComp"].toFixed(2);
      dom.byId("paid_com").innerHTML = totalComp["totalComPaid"].toFixed(2);
      dom.byId("pending_com").innerHTML = (
        totalComp["totalComp"] - totalComp["totalComPaid"]
      ).toFixed(2);
    },
    _updateInitGovt: function () {
      var popup = this._confirmPopup();
      // show
      on(
        this.initGovtUpdate,
        "click",
        lang.hitch(this, function () {
          popup.show();
          console.log("alertUser", "I am alerting you.");
        })
      );

      // register events
      popup.on(
        "execute",
        lang.hitch(this, function () {
          let featureAttributes = {};
          for (let index = 0; index < this.govFields.length; index++) {
            let element = `init_${this.govFields[index]}`;
            if (this.isValEmpty(dom.byId(element).value)) {
              console.log(dom.byId(element).value, element);
              alert("Please fill the requred details");
              return;
            }
            let val = parseFloat(dom.byId(element).value.replace(/,/g, ""));
            featureAttributes[element] = val;
          }
          featureAttributes["init_lease_duedate"] =
            dom.byId("init_lease_duedate").value;
          let initAttributes = {
            ...featureAttributes,
            ...this.wbsElements,
            parcel_id: this.parcel_id,
          };
          console.log(initAttributes);
          this.postRequiredGov(initAttributes);
        })
      );
      popup.on("cancel", function () {
        alert("Bye");
      });
    },
    _updateInitFra: function () {
      var popup = this._confirmPopup();
      // show
      on(
        this.initfraUpdate,
        "click",
        lang.hitch(this, function () {
          popup.show();
          console.log("alertUser", "I am alerting you.");
        })
      );

      // register events
      popup.on(
        "execute",
        lang.hitch(this, function () {
          let featureAttributes = {};
          for (let index = 0; index < this.forestFields.length; index++) {
            let element = `init_${this.forestFields[index]}`;
            if (this.isValEmpty(dom.byId(element).value)) {
              console.log(dom.byId(element).value, element);
              alert("Please fill the requred details");
              return;
            }
            let val = parseFloat(dom.byId(element).value.replace(/,/g, ""));
            featureAttributes[element] = val;
          }
          let initAttributes = {
            ...featureAttributes,
            ...this.wbsElements,
            parcel_id: this.parcel_id,
          };
          console.log(initAttributes);
          this.postRequiredFra(initAttributes);
        })
      );
      popup.on("cancel", function () {
        alert("Bye");
      });
    },
    _govPaymentUpdate: function () {
      var popup = this._confirmPopup();
      // show
      on(
        this.govtPayment,
        "click",
        lang.hitch(this, function () {
          popup.show();
          console.log("alertUser", "I am alerting you.");
        })
      );

      // register events
      popup.on(
        "execute",
        lang.hitch(this, function () {
          let paymentAttributes = {
            parcel_id: this.parcel_id,
          };
          let payment_detail = [];
          for (let index = 0; index < this.govFields.length; index++) {
            let compn_type = this.govFields[index];
            if (compn_type.split("_").indexOf("wbs") < 0) {
              let element = `govt_${compn_type}`;
              let wbselement = `${compn_type}_wbs`;
              let amount = parseFloat(
                dom.byId(element).value.replace(/,/g, "")
              );
              if (isNaN(amount)) {
                alert("Please fill the requred details");
                return;
              }
              console.log(amount);
              let WBS = dom.byId(wbselement).value;
              payment_detail.push({
                amount,
                compn_type,
                WBS,
              });
            }
          }
          paymentAttributes["lease_duedate"] = dom.byId("lease_duedate").value;
          paymentAttributes["payment_detail"] = payment_detail;
          paymentAttributes["sap_list"] = this.sapList;
          console.log(paymentAttributes);
          this.postRaisedPayGov(paymentAttributes);
        })
      );
      popup.on("cancel", function () {
        alert("Bye");
      });
    },
    _fraPaymentUpdate: function () {
      var popup = this._confirmPopup();
      // show
      on(
        this.fraPayment,
        "click",
        lang.hitch(this, function () {
          popup.show();
          console.log("alertUser", "I am alerting you.");
        })
      );

      // register events
      popup.on(
        "execute",
        lang.hitch(this, function () {
          let paymentAttributes = {
            parcel_id: this.parcel_id,
          };
          let payment_detail = [];
          for (let index = 0; index < this.forestFields.length; index++) {
            let compn_type = this.forestFields[index];
            if (compn_type.split("_").indexOf("wbs") < 0) {
              let element = `fra_${compn_type}`;
              let wbselement = `${compn_type}_wbs`;
              let amount = parseFloat(
                dom.byId(element).value.replace(/,/g, "")
              );
              if (isNaN(amount)) {
                alert("Please fill the requred details");
                return;
              }
              console.log(amount);
              let WBS = dom.byId(wbselement).value;
              payment_detail.push({
                amount,
                compn_type,
                WBS,
              });
            }
          }
          paymentAttributes["payment_detail"] = payment_detail;
          paymentAttributes["sap_list"] = this.sapList;
          console.log(paymentAttributes);
          this.postRaisedPayFra(paymentAttributes);
        })
      );
      popup.on("cancel", function () {
        alert("Bye");
      });
    },
    _rnrPaymentUpdate: function () {
      var popup = this._confirmPopup();
      // show
      on(
        this.rnrPayment,
        "click",
        lang.hitch(this, function () {
          popup.show();
          console.log("alertUser", "I am alerting you.");
        })
      );

      // register events
      popup.on(
        "execute",
        lang.hitch(this, function () {
          let paymentAttributes = {
            parcel_id: this.parcel_id,
            owner_id: this.owner_id,
          };
          let payment_detail = [];
          for (let index = 0; index < this.rnrWbs.length; index++) {
            let compn_type = this.rnrWbs[index];
            if (compn_type.split("_").indexOf("wbs") < 0) {
              let element = `pvt_${compn_type}`;
              let wbselement = `${compn_type}_wbs`;
              let amount = parseFloat(
                dom.byId(element).value.replace(/,/g, "")
              );
              let WBS = dom.byId(wbselement).value;
              console.log(amount);
              if (!isNaN(amount)) {
                payment_detail.push({
                  amount,
                  compn_type,
                  WBS,
                });
              }
            }
          }
          if (payment_detail.length === 0) {
            alert("Please fill the requred details");
            return;
          }
          paymentAttributes["payment_detail"] = payment_detail;
          paymentAttributes["sap_list"] = this.sapList;
          console.log(paymentAttributes);
          this.postRaisedPayRnR(paymentAttributes);
        })
      );
      popup.on("cancel", function () {
        alert("Bye");
      });
    },
    _setStatus: function (ownerList) {
      let ownerUi = "";
      for (let index = 0; index < ownerList.length; index++) {
        ownerUi += `<tr>
                        <td style="width: 5rem;">${index + 1}</td>
                        <td>${ownerList[index]["owner_name"]}</td>
                        <td style="width: 5rem;">${
                          ownerList[index]["percentage"]
                        }%</td>
                      </tr>`;
      }
      dom.byId("owner-container").innerHTML = `<table>
                      <tr>
                        <th>SN</th>
                        <th>Owner Name</th>
                        <th>Per%</th>
                      </tr>${ownerUi}
                    </table>`;
    },
    displayComponents: function (payCom) {
      this.wbsElements = {};
      this.componentsPanelList.map((lst, i) => {
        document.getElementById(lst).style.display = "none";
      });
      document.getElementById(`${this.landType}-panel`).style.display =
        "inline";
      document.getElementById("master-panel").style.display = "inline-block";
      if (payCom) {
        document.getElementById(`init-${this.landType}-panel`).style.display =
          "none";
        document.getElementById(`req-${this.landType}-panel`).style.display =
          "inline";
      } else {
        document.getElementById(`init-${this.landType}-panel`).style.display =
          "inline";
        document.getElementById(`req-${this.landType}-panel`).style.display =
          "none";
      }
    },
    getPaymentHistory: function (parcelID, ownerID) {
      // Request the JSON data from the server
      fetch(this.getPaymentHistoryService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parcel_id: parcelID, owner_id: ownerID }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          this.rnrWbs.map((pay_history, i) => {
            var paid = isNaN(
              parseFloat(data["paymentHistory"][pay_history]).toFixed(2)
            )
              ? 0
              : parseFloat(data["paymentHistory"][pay_history]).toFixed(2);
            if (pay_history.split("_").indexOf("wbs") < 0) {
              dom.byId(`pending_${pay_history}`).value =
                parseFloat(
                  dom.byId(pay_history).value.replace(/,/g, "")
                ).toFixed(2) - paid;
            }
          });
        });
    },
    getGovInfo: function (projectId, parcelID) {
      console.log("GOVT");
      // Request the JSON data from the server
      fetch(this.getGovInfoService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_id: projectId, parcel_id: parcelID }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          this.sapList = data["sapList"];
          this._setSAPUI(data["sapList"]);
          this.displayComponents(data["govtList"].length);
          this.setPaymentInfo(data);
          if (data["govtList"].length) {
            this.govtList = data["govtList"];
            this._setRegisterGovt(data["isSuccess"], data["paymentHistory"]);
          } else {
          }
        });
    },
    getFraInfo: function (projectId, parcelID) {
      console.log("FOREST");
      // Request the JSON data from the server
      fetch(this.getFraInfoService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_id: projectId, parcel_id: parcelID }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          this.sapList = data["sapList"];
          this._setSAPUI(data["sapList"]);
          this.displayComponents(data["fraList"].length);
          this.setPaymentInfo(data);
          if (data["fraList"].length) {
            this.fraList = data["fraList"];
            this._setRegisterFra(data["isSuccess"], data["paymentHistory"]);
          } else {
          }
        });
    },
    getRnRInfo: function (projectId, parcelID) {
      console.log("RNR");
      // Request the JSON data from the server
      fetch(this.getRnRInfoService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_id: projectId, parcel_id: parcelID }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          this.sapList = data["sapList"];
          this._setSAPUI(data["sapList"]);
          this._setOwnerInfo(data["ownerList"]);
          this.displayComponents(data["rnrList"].length);
          this.setPaymentInfo(data);
          if (data["rnrList"].length) {
            this.rnrList = data["rnrList"];
            this._setRnRUI(data["ownerList"]);
          } else {
            this._setInitRnRUI();
          }
        });
    },
    postRequiredRnR: function (initRnRParams) {
      console.log(initRnRParams);
      if (this.isEmpty(initRnRParams)) {
        alert("Please fill all the details to proceed!");
        return false;
      }
      // Request the JSON data from the server
      fetch(this.postInitRnRService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initRnRParams),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          alert(data.msg);
        });
    },
    postRequiredFra: function (initFraParams) {
      console.log(initFraParams);
      if (this.isEmpty(initFraParams)) {
        alert("Please fill all the details to proceed!");
        return false;
      }
      // Request the JSON data from the server
      fetch(this.postInitFraService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initFraParams),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          alert(data.msg);
        });
    },
    postRequiredGov: function (initGovParams) {
      console.log(initGovParams);
      if (this.isEmpty(initGovParams)) {
        alert("Please fill all the details to proceed!");
        return false;
      }
      // Request the JSON data from the server
      fetch(this.postInitGovService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initGovParams),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          alert(data.msg);
        });
    },
    postRaisedPayGov: function (raisedGovParams) {
      console.log(raisedGovParams);
      if (this.isEmpty(raisedGovParams)) {
        alert("Please fill all the details to proceed!");
        return false;
      }
      // Request the JSON data from the server
      fetch(this.postGovService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raisedGovParams),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          alert(data.msg);
        });
    },
    postRaisedPayFra: function (raisedFraParams) {
      console.log(raisedFraParams);
      if (this.isEmpty(raisedFraParams)) {
        alert("Please fill all the details to proceed!");
        return false;
      }
      // Request the JSON data from the server
      fetch(this.postFraService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raisedFraParams),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          alert(data.msg);
        });
    },
    postRaisedPayRnR: function (raisedRnrParams) {
      console.log(raisedRnrParams);
      if (this.isEmpty(raisedRnrParams)) {
        alert("Please fill all the details to proceed!");
        return false;
      }
      // Request the JSON data from the server
      fetch(this.postRnRService, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raisedRnrParams),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          alert(data.msg);
        });
    },
    isEmpty: function (obj) {
      for (var prop in obj) {
        if (
          (typeof obj[prop] === "number" && isNaN(obj[prop])) ||
          (typeof obj[prop] === "object" && obj[prop] === null) ||
          obj[prop] === "" ||
          obj[prop] === "undefined"
        ) {
          return true;
        }
      }
      return false;
    },
    isValEmpty: function (val) {
      if (
        (typeof val === "number" && isNaN(val)) ||
        (typeof val === "object" && val === null) ||
        val === "" ||
        val === "Please Select WBS" ||
        val === "undefined"
      ) {
        return true;
      }
      return false;
    },
    restForm: function () {
      this.ownerNamesList.value = "";
      this.rnrWbs.map((rnr, i) => {
        if (rnr.split("_").indexOf("wbs") < 0) {
          dojo.byId(`init_${rnr}`).value = "";
          dojo.byId(`pvt_${rnr}`).value = "";
        } else {
          dojo.byId(`init_${rnr}`).value = "Please Select WBS";
          dojo.byId(`${rnr}`).value = "";
        }
      });
      this.forestFields.map((fra, i) => {
        if (fra.split("_").indexOf("wbs") < 0) {
          dojo.byId(`init_${fra}`).value = "";
          dojo.byId(`fra_${fra}`).value = "";
        } else {
          dojo.byId(`init_${fra}`).value = "Please Select WBS";
          dojo.byId(`${fra}`).value = "";
        }
      });
      this.govFields.map((govt, i) => {
        if (govt.split("_").indexOf("wbs") < 0) {
          dojo.byId(`init_${govt}`).value = "";
          dojo.byId(`govt_${govt}`).value = "";
        } else {
          dojo.byId(`init_${govt}`).value = "Please Select WBS";
          dojo.byId(`${govt}`).value = "";
        }
      });
    },
  });
});
