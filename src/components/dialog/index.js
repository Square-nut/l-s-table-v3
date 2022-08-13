/*
 * @Author: liruiqing@mediway.cn 
 * @Date: 2022-08-08 20:59:14 
 * @Last Modified by:   zhenjiaguwen123@gmail.cn 
 * @Last Modified time: 2022-08-08 20:59:14 
 */

import { mapState } from "vuex";
import { timestamp, uid, event, params } from "../../utils/store-config";
const props = {
  uid: {
    default: 0
  }
};

export default {
  name: "HosBizDialog",
  props: props,
  watch: {
    sTimestamp() {
      if (this.sUID === "all" || this.sUID === this.uid) {
        this.visible = this.sEvent === "open";
      }
      const title = document.querySelectorAll('.hos-dialog__wrapper');
      title.forEach(ele=> ele.removeAttribute('title'));
    },
  },
  computed: {
    ...mapState({
      sTimestamp: state => state.dialog[timestamp],
      sUID: state => state.dialog[uid],
      sEvent: state => state.dialog[event],
      sParams: state => state.dialog[params]
    })
  },
  data() {
    return {
      visible: false
    };
  },
  render(h) {
    const props = { ...this.$attrs };
    const on = { ...this.$listeners };
    props["visible"] = this.visible;
    props["destroy-on-close"] = true;
    on["close"] = val => {
      this.$store.commit("CLOSE_DIALOG", { _uid: this.uid });
      this.$emit("close", val);
    };
    const dialogComponent = this.$store.getters['getDialogComponents'](
      this.uid
    )

    return h(
      "hos-dialog",
      {
        props,
        on
      },
      [ this.visible &&
        h(dialogComponent.component, { props: dialogComponent.props })    
      ]
    );
  }
};
