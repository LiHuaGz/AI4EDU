// 每题一份可编辑模板：只搭好计算结构，关键表达式留给学生填写，越靠后的题目提供的结构越少。
const templates = {
  trajectory: ['用两个追踪点求k和m，并检查初步轨迹的误差', `# train的每一行依次是追踪点的横坐标x和高度y，单位为米。
x, y = train[:, 0], train[:, 1]
g = 9.8
z = y / x
print("P1和P8的y／x：", z[0], z[-1])

# 两个点都满足z＝m－k·x。用你推出的关系替换下面两个None。
k = None
m = None

if k is None or m is None:
    print("请先补全k和m，再运行。")
else:
    theta = np.degrees(np.arctan(m))
    v = np.sqrt(g * (1 + m**2) / (2 * k))
    errors = y - (m * x - k * x**2)
    print("k、m：", k, m)
    print("起脚仰角θ（度）、出球速度v（米每秒）：", theta, v)
    print("8个拟合点的均方根误差（米）：", float(np.sqrt(np.mean(errors**2))))
`],
  regression: ['用最小二乘法估计参数，分别计算拟合误差和验证误差', `x, y = train[:, 0], train[:, 1]
g = 9.8
z = y / x
x_bar, z_bar = x.mean(), z.mean()
Sxx = np.sum((x - x_bar)**2)
Sxz = np.sum((x - x_bar) * (z - z_bar))
print("横坐标平均值、z的平均值：", x_bar, z_bar)
print("横坐标离差平方和Sxx：", Sxx)
print("离差乘积和Sxz：", Sxz)

# 用你写出的回归公式替换下面2个None：b是回归直线的斜率，a是截距。
b = None
a = None

if b is None or a is None:
    print("请先补全b和a，再运行。")
else:
    k, m = -b, a
    theta = np.degrees(np.arctan(m))
    v = np.sqrt(g * (1 + m**2) / (2 * k))
    print("k、θ（度）、v（米每秒）：", k, theta, v)
    errors = y - (m * x - k * x**2)
    print("拟合均方根误差（米）：", float(np.sqrt(np.mean(errors**2))))
    if len(validation):
        # 验证使用图形中已经固定的v和θ。
        locked = data["fitted"]
        xv, yv = validation[:, 0], validation[:, 1]
        mv = np.tan(np.deg2rad(locked["theta"]))
        kv = g * (1 + mv**2) / (2 * locked["v"]**2)
        ev = yv - (mv * xv - kv * xv**2)
        print("验证使用固定的v、θ：", locked["v"], locked["theta"])
        print("验证均方根误差（米）：", float(np.sqrt(np.mean(ev**2))))
    else:
        print("请先把v、θ输入图形，再点击“固定拟合参数，显示验证点”。")
`],
  habit: ['计算习惯脚法在人墙处与球门线处的高度和飞行时间', `g, D = 9.8, 20.0
v, theta = params["v"], params["theta"]   # 图形中当前的出球速度与起脚仰角
m = np.tan(np.deg2rad(theta))

def height(x):
    # 用你写出的轨迹公式替换None，返回水平位置x处球心的高度。
    return None

if height(9.15) is None:
    print("请先补全height(x)，再运行。")
else:
    print("人墙处、球门线处的高度（米）：", height(9.15), height(D))
    print("飞行时间（秒）：", D / (v * np.cos(np.deg2rad(theta))))
    print("条件①过人墙：", height(9.15) >= 2.1)
    print("条件②不出横梁：", height(D) <= 2.44)
`],
  window: ['固定出球速度，求能够破门的起脚仰角窗口', `g, D, H, bar, xw = 9.8, 20.0, 2.1, 2.44, 9.15
v = 21.6
c = g / (2 * v**2)

def roots(a, b, const):
    # 返回a·m²＋b·m＋const＝0的两个根，较小的根在前。
    d = b * b - 4 * a * const
    return (-b - d**0.5) / (2 * a), (-b + d**0.5) / (2 * a)

# 条件①：c·xw²·m²－xw·m＋（c·xw²＋H）≤0，解集在两根之间。
m_low, m_wall_high = roots(c * xw**2, -xw, c * xw**2 + H)

# 条件②：仿照条件①写出二次式的系数，取较小的根（解集在两根之外）。
m_bar = None

if m_bar is None:
    print("请先补全条件②的根m_bar，再运行。")
else:
    theta_low = np.degrees(np.arctan(m_low))
    theta_high = np.degrees(np.arctan(m_bar))
    print("窗口下限、上限、宽度（度）：", theta_low, theta_high, theta_high - theta_low)
    print("窗口上限处的飞行时间（秒）：", D / (v * np.cos(np.deg2rad(theta_high))))
`],
  accuracy: ['计算起脚仰角有偏差时的进球概率', `from math import erf, sqrt

def Phi(z):
    # 标准正态分布函数
    return 0.5 * (1 + erf(z / sqrt(2)))

sigma = 0.8
theta_low, theta_high = 18.60, 19.76   # 换成你在第4题得到的结果

def probability(aim):
    # 用你写出的P（θ₀）替换None，aim是瞄准的仰角。
    return None

if probability(20.30) is None:
    print("请先补全probability(aim)，再运行。")
else:
    print("瞄准20.30°的进球概率：", probability(20.30))
    aim_best = None   # 填写使概率最大的瞄准仰角
    if aim_best is not None:
        print("瞄准最优仰角的进球概率：", probability(aim_best))
`],
  plan: ['对出球速度逐点搜索，找出窗口最宽的方案', `from math import erf, sqrt

def Phi(z):
    return 0.5 * (1 + erf(z / sqrt(2)))

g, D, H, bar, xw, T, sigma = 9.8, 20.0, 2.1, 2.44, 9.15, 1.2, 0.8

def roots(a, b, const):
    d = b * b - 4 * a * const
    return None if d < 0 else ((-b - d**0.5) / (2 * a), (-b + d**0.5) / (2 * a))

def window(v):
    # 返回速度v下窗口的［下限，上限］（度），没有窗口时返回None。
    c = g / (2 * v**2)
    wall = roots(c * xw**2, -xw, c * xw**2 + H)
    bar_roots = None   # 横梁条件c·D²·m²－D·m＋（c·D²＋2.44）≥0的两个根
    if wall is None or bar_roots is None or D / (T * v) > 1:
        return None
    low = np.degrees(np.arctan(wall[0]))
    up_bar = np.degrees(np.arctan(bar_roots[0]))
    up_time = np.degrees(np.arccos(D / (T * v)))
    high = min(up_bar, up_time)
    return (low, high) if high > low else None

best = None
for v in np.arange(15, 26.0001, 0.01):
    w = window(v)
    if w and (best is None or w[1] - w[0] > best[1][1] - best[1][0]):
        best = (v, w)

if best is None:
    print("还没有找到窗口，请先补全window(v)里的bar_roots。")
else:
    v_star, (low, high) = best
    aim = (low + high) / 2
    print("窗口最宽的出球速度v*、窗口下限、上限（度）：", v_star, low, high)
    print("瞄准仰角、进球概率：", aim, Phi((high - aim) / sigma) - Phi((low - aim) / sigma))
`],
};

export function pythonTemplate(stageId) {
  const [title, code] = templates[stageId] || ['本题计算草稿', 'import math\nprint("在这里填写本题计算。")\n'];
  return { title, code };
}

// 传给Python的数据：已显示的追踪点、当前控件取值、固定后的拟合参数与项目常量。
export function pythonContext(project, stage, snapshot) {
  const experiment = project.experiments.find(item => item.id === stage.interaction.experimentId);
  const scene = snapshot.experiments?.[experiment.id] || {};
  const observations = experiment.config.observations?.rows || [];
  return { train: observations.filter(row => row.split === 'train').map(row => [row.x, row.y]),
    validation: scene.fit?.validationRevealed ? observations.filter(row => row.split === 'validation').map(row => [row.x, row.y]) : [],
    parameters: scene.parameters || {}, fitted: scene.fit?.parameters || null,
    constants: Object.fromEntries((project.constants || []).map(item => [item.key, item.value])) };
}
