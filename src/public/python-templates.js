const templates = {
  observations: ['读取观测点，检查初步拟合的轨道', `# train只包含用于拟合的8个点，每行依次是横坐标x和纵坐标y。
x, y = train[:, 0], train[:, 1]
r = np.hypot(x, y)
print("P1到地心的距离：", round(float(r[0]), 6), "千公里")

# 使用当前图形中的a、e，也可以改成你自己估计的数值。
a, e = params["a"], params["e"]
p = a * (1 - e**2)
errors = r - (p + e * x)
print("当前轨道的半长轴a、离心率e：", a, e)
print("拟合均方根误差：", float(np.sqrt(np.mean(errors**2))))
`],
  fitting: ['估计椭圆参数，分别计算拟合误差和验证误差', `x, y = train[:, 0], train[:, 1]
r = np.hypot(x, y)
x_bar, r_bar = x.mean(), r.mean()
Sxx = np.sum((x - x_bar)**2)
Sxr = np.sum((x - x_bar) * (r - r_bar))
print("横坐标平均值、地心距离平均值：", x_bar, r_bar)
print("横坐标离差平方和Sxx：", Sxx)
print("横坐标与距离的离差乘积和Sxr：", Sxr)

# 用你写出的关系式替换下面3个None。
e_hat = None
p_hat = None
a_hat = None

if any(v is None for v in [e_hat, p_hat, a_hat]):
    print("请补全e_hat、p_hat、a_hat，再运行。")
else:
    errors = r - (p_hat + e_hat * x)
    print("e、p、a：", e_hat, p_hat, a_hat)
    print("拟合误差：", float(np.sqrt(np.mean(errors**2))))
    if len(validation):
        xv, yv = validation[:, 0], validation[:, 1]
        rv = np.hypot(xv, yv)
        # 使用已经固定的参数检验4个预留点。
        locked = data["fitted"]
        locked_a, locked_e = locked["a"], locked["e"]
        locked_p = locked_a * (1 - locked_e**2)
        ev = rv - (locked_p + locked_e * xv)
        print("验证使用固定的a、e：", locked_a, locked_e)
        print("验证误差：", float(np.sqrt(np.mean(ev**2))))
    else:
        print("请先把a、e输入图形，再点击“固定拟合参数，显示验证点”。")
`],
  visibility: ['计算最低高度，以及两种仰角情况下的通信条件差值', `a, e = params["a"], params["e"]
R = data["constants"]["R"]
theta = np.deg2rad(20)
x = a * e + a * np.cos(theta)
y = a * np.sqrt(1 - e**2) * np.sin(theta)
print("卫星距地表的最低高度：", a * (1 - e) - R)

for epsilon in [5, 8]:
    gamma = np.deg2rad(35 + epsilon)
    # 用第3题定义的差值M（通信不等式左侧减右侧）替换None。
    margin = None
    print("最低仰角ε、端点处的差值M：", epsilon, margin)
`],
  reliability: ['按两种遮挡情况分别计算发送成功概率', `q = 0.95 * 0.90
print("能够通信时，一次完整发送成功率q：", q)

# 根据上一题填写True或False。
normal_available = None
masked_available = None

if normal_available is None or masked_available is None:
    print("请根据第3题判断两种遮挡情况下是否能够通信，分别填写True或False。")
else:
    for n in [1, 2, 3]:
        delivered = 1 - (1 - q)**n
        total = (0.8 * normal_available + 0.2 * masked_available) * delivered
        print("发送次数n、能够通信时的Qn、考虑遮挡后的Pn：", n, delivered, total)
`],
  baseline: ['计算两项要求对a的限制，再搜索最小值', `R, h = 6.371, 0.3
alpha, epsilon = 20, 5
e_grid = np.linspace(0, 0.55, 10001)
H = (R + h) / (1 - e_grid)
t = np.deg2rad(alpha)
g = np.deg2rad(35 + epsilon)

# 将第5题写出的通信下界改写成数组运算。
# 使用e_grid、np.sqrt、np.sin、np.cos，角度已转为弧度。
B = None
if B is None:
    print("请补全通信下界B，再运行搜索。")
else:
    required = np.maximum(H, B)
    index = int(np.argmin(required))
    print("逐点计算得到的e、a近似值：", e_grid[index], required[index])
    print("可增加计算点数或使用二分法继续检查精度，并解释为什么a最小。")
`],
  mission: ['分别计算方案1和方案2，再比较发送成功概率', `R, h, A = 6.371, 0.3, 9.3
q = 0.95 * 0.90

# 在这里复用上一题的几何模型。
# 先判断达到99％要求哪些遮挡情况下都能够通信，再填写需要考虑的最低仰角。
epsilon = None
if epsilon is None:
    print("请先填写需要考虑的最低仰角epsilon，再补充两种方案的计算。")
else:
    print("用于检查通信条件的最低仰角ε：", epsilon)
    # 方案1：保持a≤9.3，求通信区间的最大α和对应e。
    # 方案2：保持α＝20°，求所需的最小a和对应e，允许a超过9.3。
    # 把你的求解代码写在下面。

    print("当两种遮挡情况下都能够通信时：")
    for n in [1, 2, 3]:
        print("次数、成功率：", n, 1 - (1 - q)**n)
`],
};

export function pythonTemplate(stageId) {
  const [title, code] = templates[stageId] || ['本题计算草稿', 'import math\nprint("在这里填写本题计算。")\n'];
  return { title, code };
}

export function pythonContext(project, stage, snapshot) {
  const experiment = project.experiments.find(item => item.id === stage.interaction.experimentId);
  const scene = snapshot.experiments?.[experiment.id] || {};
  const observations = experiment.config.visualization?.observations?.rows || [];
  return { train: observations.filter(row => row.split === 'train').map(row => [row.x,row.y]),
    validation: scene.fit?.validationRevealed ? observations.filter(row => row.split === 'validation').map(row => [row.x,row.y]) : [],
    parameters: scene.parameters || {}, fitted: scene.fit?.parameters || null,
    constants: Object.fromEntries((project.constants || []).map(item => [item.key,item.value])) };
}
