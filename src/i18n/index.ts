import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    menu: {
      home: '首页',
      about: '关于',
      contact: '联系我们'
    },
    legal: {
      title: '法律提示',
      warning: '请确认您已知悉并同意以下内容：',
      securityWarning: '安全警告',
      securityNotice: '本项目仅供学习和参考！严禁用于任何非法用途！',
      securityItems: '1. 本项目开源代码仅用于技术学习和交流。\n2. 使用本项目生成的任何图片请勿用于任何非法用途。\n3. 因违法使用本项目造成的任何法律责任和损失，需自行承担，与本项目无关。\n4. 如果使用本项目请遵守相关法律法规。',
      cancel: '取消',
      confirm: '我已知悉并同意'
    },
    stamp: {
      save: '保存印章',
      saveTemplate: '保存到我的模板',
      loadTemplate: '加载模板',
      resetStamp: '重置印章',
      downloadStamp: '下载印章',
      dailyLimitReached: '未登录用户每天最多下载 {limit} 次印章，请注册登录后无限制使用',
      needLoginForTemplate: '保存模板需要登录，请先注册登录',
      needLoginForDownload: '下载印章需要登录，请先注册登录',
      needLoginForImport: '导入模板需要登录，请先注册登录',
      needLoginForExport: '导出模板需要登录，请先注册登录',
      remainingSaves: '今日剩余 {count}/{limit} 次',
      exportFormat: {
        title: '选择导出格式',
        description: '请选择您要导出的图片格式：',
        pngDesc: '支持透明背景，适合打印',
        jpegDesc: '文件较小，适合网络分享',
        svgDesc: '矢量格式，可无损缩放',
        quality: '图片质量',
        sizeTitle: '导出尺寸',
        width: '宽度',
        height: '高度',
        resetSize: '恢复默认尺寸',
        sizeHint: '默认尺寸：{width}px × {height}px',
        sizeLimit: '支持 {min}px - {max}px 范围',
        ratioTitle: '固定比例',
        ratioHint: '选择固定宽高比，或使用自定义尺寸',
        ratioOriginal: '原始比例',
        ratioSquare: '正方形',
        ratioCustom: '自定义',
        cancel: '取消',
        export: '导出'
      },
      basic: {
        title: '印章基本设置',
        extractCircle: '提取圆形印章',
        width: '印章宽度 (mm)',
        height: '印章高度 (mm)',
        borderWidth: '圆形边框宽度 (mm)',
        color: '印章颜色',
        shape: '印章形状',
        borderLineStyle: '边框线条样式',
        lineStyle: {
          solid: '实线',
          dashed: '虚线',
          dotted: '点线'
        },
        dashLength: '虚线长度 (mm)',
        gapLength: '虚线间距 (mm)',
        shapeOptions: {
          ellipse: '椭圆/圆形',
          rectangle: '矩形',
          rhombus: '菱形'
        }
      },
      company: {
        title: '公司名称列表设置',
        name: '公司名称',
        font: '字体',
        fontSize: '字体大小 (mm)',
        fontWeight: '字体粗细',
        compression: '压缩比例',
        distribution: '分布因子',
        margin: '边距 (mm)',
        color: '颜色',
        startAngle: '起始角度 (°)',
        rotateDirection: '旋转方向',
        counterclockwise: '逆时针',
        clockwise: '顺时针'
      },
      stampType: {
        title: '印章类型列表设置',
        type: '文字内容',
        fontSize: '字体大小 (mm)',
        font: '字体',
        fontWeight: '字体粗细',
        compression: '压缩比例',
        letterSpacing: '字符间距 (mm)',
        color: '颜色',
        verticalPosition: '垂直位置 (mm)',
        addNew: '添加新行',
        delete: '删除',
        line: '第 {index} 行'
      },
      star: {
        title: '五角星设置',
        enable: '绘制五角星',
        diameter: '五角星直径 (mm)',
        horizontalPosition: '水平位置 (mm)',
        verticalPosition: '垂直位置 (mm)'
      },
      security: {
        title: '防伪纹路设置',
        enable: '启用防伪纹路',
        refresh: '刷新纹路',
        count: '纹路数量',
        length: '纹路长度 (mm)',
        width: '纹路宽度 (mm)'
      },
      roughEdge: {
        title: '毛边效果设置',
        enable: '启用毛边效果',
        width: '毛边宽度 (mm)',
        height: '毛边高度 (mm)',
        probability: '毛边概率',
        shift: '毛边偏移 (mm)',
        points: '毛边点数',
        refresh: '刷新毛边'
      },
      aging: {
        title: '做旧效果',
        enable: '启用做旧效果',
        manual: '手动做旧',
        intensity: '做旧强度',
        refresh: '刷新做旧'
      },
      extract: {
        title: '提取印章',
        tool: '提取印章工具'
      },
      template: {
        title: '常用模板',
        save: '保存当前为模板',
        saveCurrent: '导出模板',
        defaultTitle: '默认模板',
        publicTemplates: '公共模板',
        preview: '预览',
        name: '模板名称',
        open: '打开模板',
        load: '加载模板',
        loadFile: '加载模板文件',
        loading: '加载中...',
        generatingPreview: '生成预览中...',
        select: '模板选择',
        loadingPublicTemplates: '加载公共模板中...',
        noPublicTemplates: '暂无公共模板',
        loadPublicTemplatesError: '加载公共模板列表失败',
        loadPublicTemplateError: '加载公共模板失败'
      },
      common: {
        line: '第 {index} 行',
        delete: '删除',
        addNew: '添加新行',
        expand: '展开',
        collapse: '收起',
        fontPlaceholder: '输入字体名称',
        fontWeightNormal: '正常',
        fontWeightBold: '粗体',
        fontWeight: {
          normal: '正常',
          bold: '粗体',
          light: '细体',
          medium: '中等',
          semibold: '半粗'
        },
        compression: '压缩比例：{value}',
        distribution: '分布因子：{value}',
        letterSpacing: '字符间距：{value} mm',
        verticalPosition: '垂直位置：{value} mm',
        preview: '预览图片'
      },
      code: {
        title: '印章编码设置',
        code: '印章编码',
        font: '字体',
        fontSize: '字体大小 (mm)',
        fontWeight: '字体粗细',
        color: '颜色',
        compression: '压缩比例',
        distribution: '分布因子',
        margin: '边距 (mm)'
      },
      taxNumber: {
        title: '中间数字设置',
        number: '数字',
        font: '字体',
        fontSize: '字体大小 (mm)',
        fontWeight: '字体粗细',
        compression: '压缩比例',
        letterSpacing: '字符间距 (mm)',
        verticalPosition: '垂直位置调整 (mm)'
      },
      images: {
        title: '图片列表设置',
        image: '图片 {index}',
        select: '选择图片',
        width: '图片宽度 (mm)',
        height: '图片高度 (mm)',
        positionX: '水平位置 (mm)',
        positionY: '垂直位置 (mm)',
        rotation: '旋转角度',
        keepRatio: '保持宽高比',
        preview: '预览'
      },
      innerCircle: {
        addNew: '新增',
        title: '内圈圆形设置',
        lineWidth: '内圈圆线宽 (mm)',
        radiusX: '内圈圆半径X (mm)',
        radiusY: '内圈圆半径Y (mm)',
        color: '颜色',
        positionX: '水平偏移 (mm)',
        positionY: '垂直偏移 (mm)',
        addEllipse: '添加圆形/椭圆内圈',
        addRectangle: '添加矩形内圈',
        addRhombus: '添加菱形内圈'
      },
      outBorder: {
        enable: '显示外圈边框',
        lineWidth: '边框宽度 (mm)'
      },
      drag: {
        label: '移动印章'
      }
    },
    elementList: {
      title: '元素列表',
      tabs: {
        all: '全部',
        text: '文字',
        figure: '图形',
        effect: '效果'
      },
      elements: {
        basicSettings: '印章基础设置',
        companyName: '公司名称',
        stampType: '印章类型',
        code: '编码',
        taxNumber: '税号',
        star: '五角星',
        innerCircle: '内圈',
        image: '图片',
        verticalLine: '竖线',
        horizontalLine: '横线',
        agingEffect: '做旧效果',
        roughEdge: '毛边效果',
        securityPattern: '防伪纹路'
      },
      status: {
        enabled: '已启用',
        disabled: '未启用',
        notSet: '未设置'
      },
      buttons: {
        addCompany: '添加公司名称',
        addStampType: '添加印章类型',
        addHorizontalLine: '添加横线',
        addVerticalLine: '添加竖线',
        addImage: '添加图片',
        addInnerCircle: '添加内圈',
        uploadSvg: '上传 SVG',
        edit: '编辑',
        clear: '清除',
        delete: '删除'
      },
      confirm: {
        deleteElement: '确定要删除这个元素吗？'
      },
      defaults: {
        newCompanyName: '新公司名称',
        newStampType: '新印章类型',
        companyNameIndex: '公司名称 {index}',
        stampTypeIndex: '印章类型 {index}',
        innerCircleIndex: '内圈 {index}',
        imageIndex: '图片 {index}',
        verticalLineIndex: '竖线 {index}',
        horizontalLineIndex: '横线 {index}',
        svgIndex: 'SVG {index}'
      }
    },
    navigation: {
      maker: '印章制作',
      about: '关于我们',
      contact: '联系我们',
      footer: {
        description: '专业的在线电子印章制作工具',
        quickLinks: '快速链接',
        legalInfo: '法律信息',
        privacyPolicy: '隐私政策',
        termsOfService: '服务条款',
        importantNotice: '重要提示',
        warning: '⚠️ 本工具仅供学习和参考使用！严禁用于任何非法用途！',
        allRightsReserved: '保留所有权利'
      }
    },
    homepage: {
      hero: {
        title: '最好的在线电子印章制作工具 - DrawStamp',
        subtitle: 'DrawStamp 是现代企业和个人使用的专业解决方案！我们的印章设计工具将帮助您为任何场合创建独特的印章产品！'
      },
      stampTypes: {
        title: '支持多种印章类型',
        types: {
          circle: '原型印章',
          ellipse: '椭圆印章',
          rectangle: '矩形印章',
          signature: '签名印章',
          date: '日期印章',
          text: '文字印章',
          chinese: '中文印章'
        }
      },
      whyChoose: {
        title: '为什么选择 DrawStamp？',
        features: {
          allInOne: {
            title: '所有印章类型一站式服务',
            description: '支持各种类型的印章制作，满足不同需求'
          },
          available247: {
            title: '24/7 随时制作',
            description: '不受时间限制，随时随地创建您的印章'
          },
          multiDevice: {
            title: '多设备兼容',
            description: '支持电脑、平板和手机，随时随地使用'
          },
          global: {
            title: '全球可用',
            description: '无论您在世界任何角落，都可以使用我们的服务'
          },
          free: {
            title: '完全免费',
            description: '无需设计师，无需等待，完全免费使用'
          },
          download: {
            title: '随时下载',
            description: '下载您的设计结果，可无限次使用'
          }
        }
      },
      howItWorks: {
        title: '只需几个步骤，即可完成您的印章！',
        steps: {
          step1: {
            title: '选择形状和尺寸',
            description: '选择圆形、矩形或三角形，设置您需要的尺寸'
          },
          step2: {
            title: '添加文本和内容',
            description: '输入公司名称、印章类型、编码、税号等信息'
          },
          step3: {
            title: '自定义设计',
            description: '调整字体、颜色、大小、位置等细节参数'
          },
          step4: {
            title: '下载使用',
            description: '以 PNG 格式下载，可直接使用或添加到文档中'
          }
        },
        cta: '免费试用'
      },
      features: {
        title: '我们的印章制作工具让您能够快速：',
        items: {
          logo: {
            title: '创建带 Logo 的印章',
            description: '支持上传自定义 Logo 或从图库中选择'
          },
          template: {
            title: '选择模板快速制作',
            description: '提供多种预设模板，只需输入数据即可'
          },
          formats: {
            title: '多种格式下载',
            description: '支持 PNG、SVG 等格式，满足不同需求'
          },
          documents: {
            title: '添加到文档',
            description: '可直接添加到 PDF 或 Word 文档中'
          }
        }
      },
      faq: {
        title: '常见问题',
        questions: {
          q1: {
            question: '如何在线制作自己的印章？',
            answer: '访问 DrawStamp，使用我们的图形编辑器即可创建。直观的界面简单易用。创建完成后，您可以下载设计文件。'
          },
          q2: {
            question: '制作印章需要多长时间？',
            answer: '使用我们的在线工具，只需几分钟即可完成印章设计。整个过程简单快捷，无需等待。'
          },
          q3: {
            question: '可以自定义印章吗？',
            answer: '当然可以！您可以完全自定义印章的所有元素，包括文本、字体、颜色、大小、位置等。'
          },
          q4: {
            question: '支持哪些文件格式？',
            answer: '我们支持 PNG 格式下载，保证印章的清晰度和质量。所有处理都在本地完成，保护您的隐私。'
          },
          q5: {
            question: '可以在手机上使用吗？',
            answer: '可以！DrawStamp 支持所有智能设备，包括电脑、平板和手机，只要有网络连接即可使用。'
          },
          q6: {
            question: '使用是免费的吗？',
            answer: '是的，DrawStamp 完全免费使用。您可以随时创建、编辑和下载您的印章设计。'
          }
        }
      },
      canvas: {
        importTemplate: '导入模板',
        exportTemplate: '导出模板',
        resetStamp: '重置印章',
        download: '下载'
      }
    },
    about: {
      title: '关于我们',
      whatIs: {
        title: '什么是 DrawStamp？',
        description: 'DrawStamp 是一个专业的在线电子印章制作工具，旨在为用户提供简单、便捷的印章设计和制作服务。我们致力于通过先进的技术和友好的用户界面，让每个人都能轻松创建高质量的电子印章。'
      },
      mission: {
        title: '我们的使命',
        description: '我们的使命是提供安全、可靠、易用的电子印章制作工具，同时确保用户了解并遵守相关法律法规。我们相信技术应该服务于合法和正当的目的。'
      },
      features: {
        title: '主要功能',
        items: {
          customDesign: '自定义设计：支持多种印章样式和元素的自定义，包括公司名称、印章类型、编码、税号等',
          templateSystem: '模板系统：提供多种预设模板，快速创建专业印章',
          advancedEffects: '高级效果：支持防伪纹路、做旧效果、毛边效果等多种视觉效果',
          localProcessing: '本地处理：所有处理都在您的浏览器本地完成，保护您的隐私和数据安全',
          multilingual: '多语言支持：支持中文和英文界面'
        }
      },
      technology: {
        title: '技术特点',
        description: 'DrawStamp 基于现代 Web 技术构建：',
        items: {
          vue: '使用 Vue 3 框架，提供流畅的用户体验',
          typescript: 'TypeScript 开发，确保代码质量和可维护性',
          canvas: 'Canvas API 实现高质量的印章渲染',
          responsive: '响应式设计，支持各种设备访问'
        }
      },
      usage: {
        title: '使用说明',
        description: '使用 DrawStamp 非常简单：',
        steps: {
          step1: '在左侧控制面板中设置印章的基本参数（尺寸、颜色等）',
          step2: '添加公司名称、印章类型、编码等信息',
          step3: '根据需要调整字体、大小、位置等细节',
          step4: '预览效果，满意后保存为 PNG 图片'
        }
      },
      warning: {
        title: '重要提示',
        securityWarning: '⚠️ 安全警告',
        notice: '本工具仅供学习和参考使用！严禁用于任何非法用途！',
        items: {
          item1: '使用本工具生成的任何图片请勿用于任何非法用途',
          item2: '因违法使用本工具造成的任何法律责任和损失，需自行承担',
          item3: '请遵守相关法律法规，合法使用本工具'
        }
      },
      openSource: {
        title: '开源项目',
        description: 'DrawStamp 是一个开源项目，欢迎贡献代码和建议。我们的目标是创建一个透明、可信赖的工具。'
      },
      contact: {
        title: '联系我们',
        description: '如果您有任何问题、建议或反馈，请通过我们的',
        linkText: '联系我们'
      }
    },
    contact: {
      title: '联系我们',
      intro: '我们很乐意听到您的声音！如果您有任何问题、建议或反馈，请通过以下方式与我们联系。',
      methods: {
        title: '联系方式',
        email: {
          title: '📧 邮箱',
          description: '最直接的方式是发送邮件，我们会在 1-2 个工作日内回复。',
          sendEmail: '发送邮件',
          tip: '请描述问题场景、浏览器环境以及复现步骤，方便我们快速定位。'
        },
        bugReport: {
          title: '🐛 问题反馈',
          description: '如果您在使用过程中遇到任何问题或发现 bug，欢迎在项目仓库中提交 Issue。'
        },
        suggestion: {
          title: '💡 功能建议',
          description: '我们欢迎您的功能建议和改进意见。您的反馈对我们非常重要！'
        },
        contribute: {
          title: '🤝 贡献代码',
          description: 'DrawStamp 是一个开源项目，我们欢迎社区贡献。如果您想参与开发，请查看项目的 GitHub 仓库。'
        }
      },
      faq: {
        title: '常见问题',
        questions: {
          q1: {
            question: '使用 DrawStamp 制作的印章可以用于商业用途吗？',
            answer: '可以，但请确保您有使用该印章的合法权利，并遵守相关法律法规。严禁用于任何非法用途。'
          },
          q2: {
            question: '我的印章数据会被上传到服务器吗？',
            answer: '不会。所有处理都在您的浏览器本地完成，我们不会收集或存储您的印章数据。'
          },
          q3: {
            question: '这个工具是免费的吗？',
            answer: '是的，DrawStamp 是完全免费使用的。'
          },
          q4: {
            question: '如何保存我制作的印章？',
            answer: '点击"保存印章"按钮，印章会以 PNG 格式下载到您的设备。'
          },
          q5: {
            question: '支持哪些浏览器？',
            answer: '支持所有现代浏览器，包括 Chrome、Firefox、Safari、Edge 等。'
          }
        }
      },
      form: {
        title: '反馈表单',
        description: '您也可以填写以下表单，我们会生成一封邮件草稿并发送至官方邮箱。',
        name: '姓名（可选）',
        email: '邮箱（可选，便于我们回复）',
        subject: '主题',
        message: '消息内容',
        submit: '发送反馈邮件',
        subjects: {
          question: '问题咨询',
          bug: 'Bug 报告',
          suggestion: '功能建议',
          other: '其他'
        },
        status: {
          success: '邮件客户端已打开，请确认内容后发送。',
          error: '生成邮件失败，请直接发送。'
        }
      },
      links: {
        title: '相关链接'
      }
    },
    common: {
      properties: {
        title: '属性设置',
        showAll: '显示全部'
      },
      language: {
        chinese: '中文',
        english: 'English'
      }
    },
    errors: {
      loadTemplateFailed: '加载模板文件失败，请检查文件格式是否正确',
      loadTemplateError: '加载模板失败',
      readSvgFailed: '读取 SVG 文件失败'
    },
    auth: {
      login: '登录',
      register: '注册',
      logout: '退出登录',
      email: '邮箱',
      password: '密码',
      emailPlaceholder: '请输入邮箱',
      passwordPlaceholder: '请输入密码（至少6位）',
      loading: '处理中...',
      error: '操作失败，请稍后重试',
      success: '操作成功'
    },
    templateManage: {
      title: '我的模板',
      subtitle: '管理和复用你的专属印章模板',
      upload: '上传模板',
      uploadTitle: '上传新模板',
      editTitle: '编辑模板',
      name: '模板名称',
      description: '模板描述',
      noDescription: '暂无描述，点击编辑添加更多信息',
      file: '模板文件',
      previewImage: '预览图片',
      previewRequired: '请上传模板预览图',
      vipUnlimited: 'VIP 用户可无限上传模板',
      remaining: '剩余可上传模板：{count}/5',
      needVip: '模板数量已达上限，请升级 VIP 后继续',
      loading: '加载中...',
      empty: '暂无模板，点击上传按钮创建第一个模板',
      load: '加载',
      edit: '编辑',
      delete: '删除',
      share: '分享',
      cancel: '取消',
      save: '保存',
      uploading: '上传中...',
      updating: '更新中...',
      loadError: '加载模板列表失败',
      uploadError: '上传模板失败',
      updateError: '更新模板失败',
      deleteError: '删除模板失败',
      deleteConfirm: '确定要删除这个模板吗？',
      shareConfirm: '确定要将此模板分享到公共模板吗？',
      shareSuccess: '分享成功！',
      shareError: '分享失败',
      sharedBadge: '已分享',
      sharedTooltip: '此模板已分享至公共模板',
      needLogin: '请先登录',
      nameRequired: '请输入模板名称',
      uploadSuccess: '保存成功！'
    },
    publicTemplates: {
      title: '公共模板',
      all: '全部模板',
      myCollections: '我的收藏',
      systemTemplate: '系统模板',
      loading: '加载中...',
      empty: '暂无公共模板',
      loadError: '加载模板失败',
      collectError: '收藏操作失败',
      load: '加载',
      collect: '收藏',
      uncollect: '取消收藏',
      by: '分享者',
      sortByDate: '按时间排序',
      sortByCollect: '按收藏数排序',
      sortByView: '按查看数排序'
    }
  },
  en: {
    menu: {
      home: 'Home',
      about: 'About',
      contact: 'Contact'
    },
    legal: {
      title: 'Legal Notice',
      warning: 'Please confirm that you understand and agree to the following:',
      securityWarning: 'Security Warning',
      securityNotice: 'This project is for learning and reference only! It is strictly prohibited for any illegal use!',
      securityItems: '1. This project\'s open source code is only for technical learning and communication.\n2. Do not use any images generated by this project for any illegal purposes.\n3. You are responsible for any legal liability and losses caused by illegal use of this project.\n4. Please comply with relevant laws and regulations when using this project.',
      cancel: 'Cancel',
      confirm: 'I understand and agree'
    },
    stamp: {
      save: 'Save Stamp',
      saveTemplate: 'Save to My Templates',
      loadTemplate: 'Load Template',
      resetStamp: 'Reset Stamp',
      downloadStamp: 'Download Stamp',
      dailyLimitReached: 'Guest users can download up to {limit} stamps per day. Please register and login for unlimited access',
      needLoginForTemplate: 'Saving templates requires login. Please register and login first',
      needLoginForDownload: 'Downloading stamps requires login. Please register and login first',
      needLoginForImport: 'Importing templates requires login. Please register and login first',
      needLoginForExport: 'Exporting templates requires login. Please register and login first',
      remainingSaves: 'Remaining {count}/{limit} today',
      exportFormat: {
        title: 'Select Export Format',
        description: 'Please select the image format you want to export:',
        pngDesc: 'Supports transparent background, suitable for printing',
        jpegDesc: 'Smaller file size, suitable for web sharing',
        svgDesc: 'Vector format, can be scaled without loss',
        quality: 'Image Quality',
        sizeTitle: 'Export Size',
        width: 'Width',
        height: 'Height',
        resetSize: 'Reset to Default Size',
        sizeHint: 'Default size: {width}px × {height}px',
        sizeLimit: 'Supported range: {min}px - {max}px',
        ratioTitle: 'Aspect Ratio',
        ratioHint: 'Select a fixed aspect ratio or use custom size',
        ratioOriginal: 'Original',
        ratioSquare: 'Square',
        ratioCustom: 'Custom',
        cancel: 'Cancel',
        export: 'Export'
      },
      basic: {
        title: 'Basic Stamp Settings',
        extractCircle: 'Extract Circle Stamp',
        width: 'Stamp Width (mm)',
        height: 'Stamp Height (mm)',
        borderWidth: 'Circle Border Width (mm)',
        color: 'Stamp Color',
        shape: 'Stamp Shape',
        borderLineStyle: 'Border Line Style',
        lineStyle: {
          solid: 'Solid',
          dashed: 'Dashed',
          dotted: 'Dotted'
        },
        dashLength: 'Dash Length (mm)',
        gapLength: 'Gap Length (mm)',
        shapeOptions: {
          ellipse: 'Ellipse/Circle',
          rectangle: 'Rectangle',
          rhombus: 'Rhombus'
        }
      },
      company: {
        title: 'Company Name List Settings',
        name: 'Company Name',
        font: 'Font',
        fontSize: 'Font Size (mm)',
        fontWeight: 'Font Weight',
        compression: 'Compression Ratio',
        distribution: 'Distribution Factor',
        margin: 'Margin (mm)',
        color: 'Color',
        startAngle: 'Start Angle (°)',
        rotateDirection: 'Rotate Direction',
        counterclockwise: 'Counter Clockwise',
        clockwise: 'Clockwise'
      },
      stampType: {
        title: 'Stamp Type List Settings',
        type: 'Text Content',
        fontSize: 'Font Size (mm)',
        font: 'Font',
        fontWeight: 'Font Weight',
        compression: 'Compression Ratio',
        letterSpacing: 'Letter Spacing (mm)',
        color: 'Color',
        verticalPosition: 'Vertical Position (mm)',
        addNew: 'Add New',
        delete: 'Delete',
        line: 'Line {index}'
      },
      star: {
        title: 'Star Settings',
        enable: 'Draw Star',
        diameter: 'Star Diameter (mm)',
        horizontalPosition: 'Horizontal Position (mm)',
        verticalPosition: 'Vertical Position (mm)'
      },
      security: {
        title: 'Security Pattern Settings',
        enable: 'Enable Security Pattern',
        refresh: 'Refresh Pattern',
        count: 'Pattern Count',
        length: 'Pattern Length (mm)',
        width: 'Pattern Width (mm)'
      },
      roughEdge: {
        title: 'Rough Edge Settings',
        enable: 'Enable Rough Edge',
        width: 'Edge Width (mm)',
        height: 'Edge Height (mm)',
        probability: 'Edge Probability',
        shift: 'Edge Shift (mm)',
        points: 'Edge Points',
        refresh: 'Refresh Edge'
      },
      aging: {
        title: 'Aging Effect',
        enable: 'Enable Aging',
        manual: 'Manual Aging',
        intensity: 'Aging Intensity',
        refresh: 'Refresh Aging'
      },
      extract: {
        title: 'Extract Stamp',
        tool: 'Extract Stamp Tool'
      },
      template: {
        title: 'Common Templates',
        save: 'Save Current as Template',
        saveCurrent: 'Export Template',
        defaultTitle: 'Default Templates',
        publicTemplates: 'Public Templates',
        preview: 'Preview',
        name: 'Template Name',
        open: 'Open Template',
        load: 'Load Template',
        loadFile: 'Load Template File',
        loading: 'Loading...',
        generatingPreview: 'Generating Preview...',
        select: 'Template Selection',
        loadingPublicTemplates: 'Loading public templates...',
        noPublicTemplates: 'No public templates',
        loadPublicTemplatesError: 'Failed to load public templates list',
        loadPublicTemplateError: 'Failed to load public template'
      },
      common: {
        line: 'Line {index}',
        delete: 'Delete',
        addNew: 'Add New',
        expand: 'Expand',
        collapse: 'Collapse',
        fontPlaceholder: 'Enter font name',
        fontWeightNormal: 'Normal',
        fontWeightBold: 'Bold',
        fontWeight: {
          normal: 'Normal',
          bold: 'Bold',
          light: 'Light',
          medium: 'Medium',
          semibold: 'Semi Bold'
        },
        compression: 'Compression: {value}',
        distribution: 'Distribution: {value}',
        letterSpacing: 'Letter Spacing: {value} mm',
        verticalPosition: 'Vertical Position: {value} mm',
        preview: 'Preview Image'
      },
      code: {
        title: 'Stamp Code Settings',
        code: 'Stamp Code',
        font: 'Font',
        fontSize: 'Font Size (mm)',
        fontWeight: 'Font Weight',
        color: 'Color',
        compression: 'Compression Ratio',
        distribution: 'Distribution Factor',
        margin: 'Margin (mm)'
      },
      taxNumber: {
        title: 'Center Number Settings',
        number: 'Tax Number',
        font: 'Font',
        fontSize: 'Font Size (mm)',
        fontWeight: 'Font Weight',
        compression: 'Compression Ratio',
        letterSpacing: 'Letter Spacing (mm)',
        verticalPosition: 'Vertical Position (mm)'
      },
      images: {
        title: 'Image List Settings',
        image: 'Image {index}',
        select: 'Select Image',
        width: 'Image Width (mm)',
        height: 'Image Height (mm)',
        positionX: 'Horizontal Position (mm)',
        positionY: 'Vertical Position (mm)',
        rotation: 'Rotation Angle',
        keepRatio: 'Keep Aspect Ratio',
        preview: 'Preview'
      },
      innerCircle: {
        addNew: 'Add New',
        title: 'Inner Circle Settings',
        lineWidth: 'Circle Line Width (mm)',
        radiusX: 'Circle Radius X (mm)',
        radiusY: 'Circle Radius Y (mm)',
        color: 'Color',
        positionX: 'Offset X (mm)',
        positionY: 'Offset Y (mm)',
        addEllipse: 'Add Ellipse Circle',
        addRectangle: 'Add Rectangle Circle',
        addRhombus: 'Add Rhombus Circle'
      },
      outBorder: {
        enable: 'Show Outer Border',
        lineWidth: 'Border Width (mm)'
      },
      drag: {
        label: 'Move Stamp'
      }
    },
    elementList: {
      title: 'Element List',
      tabs: {
        all: 'All',
        text: 'Text',
        figure: 'Figure',
        effect: 'Effect'
      },
      elements: {
        basicSettings: 'Basic Stamp Settings',
        companyName: 'Company Name',
        stampType: 'Stamp Type',
        code: 'Code',
        taxNumber: 'Tax Number',
        star: 'Star',
        innerCircle: 'Inner Circle',
        image: 'Image',
        verticalLine: 'Vertical Line',
        horizontalLine: 'Horizontal Line',
        agingEffect: 'Aging Effect',
        roughEdge: 'Rough Edge',
        securityPattern: 'Security Pattern'
      },
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled',
        notSet: 'Not Set'
      },
      buttons: {
        addCompany: 'Add Company Name',
        addStampType: 'Add Stamp Type',
        addHorizontalLine: 'Add Horizontal Line',
        addVerticalLine: 'Add Vertical Line',
        addImage: 'Add Image',
        addInnerCircle: 'Add Inner Circle',
        uploadSvg: 'Upload SVG',
        edit: 'Edit',
        clear: 'Clear',
        delete: 'Delete'
      },
      confirm: {
        deleteElement: 'Are you sure you want to delete this element?'
      },
      defaults: {
        newCompanyName: 'New Company Name',
        newStampType: 'New Stamp Type',
        companyNameIndex: 'Company Name {index}',
        stampTypeIndex: 'Stamp Type {index}',
        innerCircleIndex: 'Inner Circle {index}',
        imageIndex: 'Image {index}',
        verticalLineIndex: 'Vertical Line {index}',
        horizontalLineIndex: 'Horizontal Line {index}',
        svgIndex: 'SVG {index}'
      }
    },
    navigation: {
      maker: 'Stamp Maker',
      about: 'About Us',
      contact: 'Contact Us',
      footer: {
        description: 'Professional Online Electronic Stamp Maker',
        quickLinks: 'Quick Links',
        legalInfo: 'Legal Information',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        importantNotice: 'Important Notice',
        warning: '⚠️ This tool is for learning and reference only! It is strictly prohibited for any illegal use!',
        allRightsReserved: 'All rights reserved'
      }
    },
    homepage: {
      hero: {
        title: 'Best Online Electronic Stamp Maker - DrawStamp',
        subtitle: 'DrawStamp is a professional solution for modern businesses and individuals! Our stamp design tool will help you create unique stamp products for any occasion!'
      },
      stampTypes: {
        title: 'Support Multiple Stamp Types',
        types: {
          circle: 'Circle Stamp',
          ellipse: 'Ellipse Stamp',
          rectangle: 'Rectangle Stamp',
          signature: 'Signature Stamp',
          date: 'Date Stamp',
          text: 'Text Stamp',
          chinese: 'Chinese Stamp'
        }
      },
      whyChoose: {
        title: 'Why Choose DrawStamp?',
        features: {
          allInOne: {
            title: 'All-in-One Stamp Service',
            description: 'Support various types of stamp making to meet different needs'
          },
          available247: {
            title: '24/7 Available',
            description: 'No time restrictions, create your stamp anytime, anywhere'
          },
          multiDevice: {
            title: 'Multi-Device Compatible',
            description: 'Support computers, tablets and mobile phones, use anywhere'
          },
          global: {
            title: 'Globally Available',
            description: 'No matter where you are in the world, you can use our service'
          },
          free: {
            title: 'Completely Free',
            description: 'No designer needed, no waiting, completely free to use'
          },
          download: {
            title: 'Download Anytime',
            description: 'Download your design results, use unlimited times'
          }
        }
      },
      howItWorks: {
        title: 'Complete Your Stamp in Just a Few Steps!',
        steps: {
          step1: {
            title: 'Choose Shape and Size',
            description: 'Choose circle, rectangle or triangle, set the size you need'
          },
          step2: {
            title: 'Add Text and Content',
            description: 'Enter company name, stamp type, code, tax number and other information'
          },
          step3: {
            title: 'Customize Design',
            description: 'Adjust font, color, size, position and other detailed parameters'
          },
          step4: {
            title: 'Download and Use',
            description: 'Download in PNG format, can be used directly or added to documents'
          }
        },
        cta: 'Try Free'
      },
      features: {
        title: 'Our Stamp Maker Tool Allows You to Quickly:',
        items: {
          logo: {
            title: 'Create Stamps with Logo',
            description: 'Support uploading custom Logo or selecting from gallery'
          },
          template: {
            title: 'Quick Creation with Templates',
            description: 'Provide multiple preset templates, just enter data'
          },
          formats: {
            title: 'Multiple Format Downloads',
            description: 'Support PNG, SVG and other formats to meet different needs'
          },
          documents: {
            title: 'Add to Documents',
            description: 'Can be directly added to PDF or Word documents'
          }
        }
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: {
          q1: {
            question: 'How to make your own stamp online?',
            answer: 'Visit DrawStamp and use our graphic editor to create. The intuitive interface is easy to use. After creation, you can download the design file.'
          },
          q2: {
            question: 'How long does it take to make a stamp?',
            answer: 'With our online tool, it only takes a few minutes to complete the stamp design. The whole process is simple and fast, no waiting required.'
          },
          q3: {
            question: 'Can I customize the stamp?',
            answer: 'Of course! You can fully customize all elements of the stamp, including text, font, color, size, position, etc.'
          },
          q4: {
            question: 'What file formats are supported?',
            answer: 'We support PNG format download, ensuring the clarity and quality of the stamp. All processing is done locally, protecting your privacy.'
          },
          q5: {
            question: 'Can I use it on mobile?',
            answer: 'Yes! DrawStamp supports all smart devices, including computers, tablets and mobile phones, as long as there is an internet connection.'
          },
          q6: {
            question: 'Is it free to use?',
            answer: 'Yes, DrawStamp is completely free to use. You can create, edit and download your stamp designs anytime.'
          }
        }
      },
      canvas: {
        importTemplate: 'Import Template',
        exportTemplate: 'Export Template',
        resetStamp: 'Reset Stamp',
        download: 'Download'
      }
    },
    about: {
      title: 'About Us',
      whatIs: {
        title: 'What is DrawStamp?',
        description: 'DrawStamp is a professional online electronic stamp maker tool designed to provide users with simple and convenient stamp design and creation services. We are committed to enabling everyone to easily create high-quality electronic stamps through advanced technology and user-friendly interface.'
      },
      mission: {
        title: 'Our Mission',
        description: 'Our mission is to provide safe, reliable and easy-to-use electronic stamp maker tools while ensuring users understand and comply with relevant laws and regulations. We believe technology should serve legal and legitimate purposes.'
      },
      features: {
        title: 'Main Features',
        items: {
          customDesign: 'Custom Design: Support customization of various stamp styles and elements, including company name, stamp type, code, tax number, etc.',
          templateSystem: 'Template System: Provide multiple preset templates for quick creation of professional stamps',
          advancedEffects: 'Advanced Effects: Support various visual effects such as security patterns, aging effects, rough edge effects',
          localProcessing: 'Local Processing: All processing is done locally in your browser, protecting your privacy and data security',
          multilingual: 'Multilingual Support: Support Chinese and English interfaces'
        }
      },
      technology: {
        title: 'Technical Features',
        description: 'DrawStamp is built on modern web technologies:',
        items: {
          vue: 'Using Vue 3 framework to provide smooth user experience',
          typescript: 'TypeScript development to ensure code quality and maintainability',
          canvas: 'Canvas API for high-quality stamp rendering',
          responsive: 'Responsive design, support access from various devices'
        }
      },
      usage: {
        title: 'Usage Instructions',
        description: 'Using DrawStamp is very simple:',
        steps: {
          step1: 'Set the basic parameters of the stamp (size, color, etc.) in the left control panel',
          step2: 'Add company name, stamp type, code and other information',
          step3: 'Adjust font, size, position and other details as needed',
          step4: 'Preview the effect, and save as PNG image when satisfied'
        }
      },
      warning: {
        title: 'Important Notice',
        securityWarning: '⚠️ Security Warning',
        notice: 'This tool is for learning and reference only! It is strictly prohibited for any illegal use!',
        items: {
          item1: 'Do not use any images generated by this tool for any illegal purposes',
          item2: 'You are responsible for any legal liability and losses caused by illegal use of this tool',
          item3: 'Please comply with relevant laws and regulations and use this tool legally'
        }
      },
      openSource: {
        title: 'Open Source Project',
        description: 'DrawStamp is an open source project, welcome to contribute code and suggestions. Our goal is to create a transparent and trustworthy tool.'
      },
      contact: {
        title: 'Contact Us',
        description: 'If you have any questions, suggestions or feedback, please contact us through our',
        linkText: 'Contact Us'
      }
    },
    contact: {
      title: 'Contact Us',
      intro: 'We would love to hear from you! If you have any questions, suggestions or feedback, please contact us through the following methods.',
      methods: {
        title: 'Contact Methods',
        email: {
          title: '📧 Email',
          description: 'The most direct way is to send an email, we will reply within 1-2 business days.',
          sendEmail: 'Send Email',
          tip: 'Please describe the problem scenario, browser environment and reproduction steps to help us quickly locate the issue.'
        },
        bugReport: {
          title: '🐛 Bug Report',
          description: 'If you encounter any problems or find bugs during use, welcome to submit an Issue in the project repository.'
        },
        suggestion: {
          title: '💡 Feature Suggestion',
          description: 'We welcome your feature suggestions and improvement opinions. Your feedback is very important to us!'
        },
        contribute: {
          title: '🤝 Contribute Code',
          description: 'DrawStamp is an open source project, we welcome community contributions. If you want to participate in development, please check the project\'s GitHub repository.'
        }
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: {
          q1: {
            question: 'Can stamps made with DrawStamp be used for commercial purposes?',
            answer: 'Yes, but please ensure you have the legal right to use the stamp and comply with relevant laws and regulations. It is strictly prohibited for any illegal use.'
          },
          q2: {
            question: 'Will my stamp data be uploaded to the server?',
            answer: 'No. All processing is done locally in your browser, we do not collect or store your stamp data.'
          },
          q3: {
            question: 'Is this tool free?',
            answer: 'Yes, DrawStamp is completely free to use.'
          },
          q4: {
            question: 'How to save the stamp I made?',
            answer: 'Click the "Save Stamp" button, and the stamp will be downloaded to your device in PNG format.'
          },
          q5: {
            question: 'Which browsers are supported?',
            answer: 'All modern browsers are supported, including Chrome, Firefox, Safari, Edge, etc.'
          }
        }
      },
      form: {
        title: 'Feedback Form',
        description: 'You can also fill out the following form, and we will generate an email draft and send it to the official email.',
        name: 'Name (Optional)',
        email: 'Email (Optional, for our reply)',
        subject: 'Subject',
        message: 'Message Content',
        submit: 'Send Feedback Email',
        subjects: {
          question: 'Question',
          bug: 'Bug Report',
          suggestion: 'Feature Suggestion',
          other: 'Other'
        },
        status: {
          success: 'Email client has been opened, please confirm the content before sending.',
          error: 'Failed to generate email, please send directly.'
        }
      },
      links: {
        title: 'Related Links'
      }
    },
    common: {
      properties: {
        title: 'Properties',
        showAll: 'Show All'
      },
      language: {
        chinese: 'Chinese',
        english: 'English'
      }
    },
    errors: {
      loadTemplateFailed: 'Failed to load template file, please check if the file format is correct',
      loadTemplateError: 'Failed to load template',
      readSvgFailed: 'Failed to read SVG file'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'Please enter your email',
      passwordPlaceholder: 'Please enter password (at least 6 characters)',
      loading: 'Processing...',
      error: 'Operation failed, please try again later',
      success: 'Operation successful'
    },
    templateManage: {
      title: 'My Templates',
      subtitle: 'Organize and reuse your favorite stamp templates',
      upload: 'Upload Template',
      uploadTitle: 'Upload New Template',
      editTitle: 'Edit Template',
      name: 'Template Name',
      description: 'Template Description',
      noDescription: 'No description yet. Click edit to add more details.',
      file: 'Template File',
      previewImage: 'Preview Image',
      previewRequired: 'Please upload a preview image',
      vipUnlimited: 'VIP users can upload unlimited templates',
      remaining: 'Remaining uploads: {count}/5',
      needVip: 'Template limit reached. Upgrade to VIP for unlimited uploads.',
      loading: 'Loading...',
      empty: 'No templates yet, click upload to create your first template',
      load: 'Load',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      cancel: 'Cancel',
      save: 'Save',
      uploading: 'Uploading...',
      updating: 'Updating...',
      loadError: 'Failed to load template list',
      uploadError: 'Failed to upload template',
      updateError: 'Failed to update template',
      deleteError: 'Failed to delete template',
      deleteConfirm: 'Are you sure you want to delete this template?',
      shareConfirm: 'Are you sure you want to share this template to public templates?',
      shareSuccess: 'Share successful!',
      shareError: 'Share failed',
      sharedBadge: 'Shared',
      sharedTooltip: 'This template has already been shared',
      needLogin: 'Please login first',
      nameRequired: 'Please enter template name',
      uploadSuccess: 'Saved successfully!'
    },
    publicTemplates: {
      title: 'Public Templates',
      all: 'All Templates',
      myCollections: 'My Collections',
      systemTemplate: 'System Template',
      loading: 'Loading...',
      empty: 'No public templates',
      loadError: 'Failed to load templates',
      collectError: 'Collection operation failed',
      load: 'Load',
      collect: 'Collect',
      uncollect: 'Uncollect',
      by: 'By',
      sortByDate: 'Sort by Date',
      sortByCollect: 'Sort by Collections',
      sortByView: 'Sort by Views'
    }
  }
}

const i18n = createI18n({
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 备用语言
  messages
})

export default i18n
