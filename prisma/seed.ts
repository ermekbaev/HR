import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Очищаем в правильном порядке
  await prisma.notification.deleteMany()
  await prisma.surveyCompletion.deleteMany()
  await prisma.survey.deleteMany()
  await prisma.task.deleteMany()
  await prisma.candidate.deleteMany()
  await prisma.user.deleteMany()

  // Пользователи
  const employee = await prisma.user.create({
    data: {
      id: 'user_employee',
      username: 'employee',
      name: 'Эдуард Алтунбаев',
      email: 'eduard@company.com',
      password: '123',
      role: 'employee',
      department: 'IT отдел',
      position: 'Junior разработчик',
      status: 'active',
      skillCoins: 1250,
      lastLogin: new Date('2024-01-14T10:30:00')
    }
  })

  await prisma.user.create({
    data: {
      id: 'user_mentor',
      username: 'mentor',
      name: 'Михаил Иванов',
      email: 'mikhail@company.com',
      password: '123',
      role: 'mentor',
      department: 'IT отдел',
      position: 'Ведущий разработчик',
      status: 'active',
      skillCoins: 2850,
      lastLogin: new Date('2024-01-14T08:15:00')
    }
  })

  await prisma.user.create({
    data: {
      id: 'user_manager',
      username: 'manager',
      name: 'Елена Смирнова',
      email: 'elena@company.com',
      password: '123',
      role: 'manager',
      department: 'Управление персоналом',
      position: 'HR-менеджер',
      status: 'active',
      skillCoins: 0,
      lastLogin: new Date('2024-01-14T09:45:00')
    }
  })

  await prisma.user.create({
    data: {
      id: 'user_hr',
      username: 'hr',
      name: 'Ольга Кузнецова',
      email: 'olga@company.com',
      password: '123',
      role: 'hr',
      department: 'HR отдел',
      position: 'HR-специалист',
      status: 'active',
      skillCoins: 0,
      lastLogin: new Date('2024-01-14T11:00:00')
    }
  })

  await prisma.user.create({
    data: {
      id: 'user_admin',
      username: 'admin',
      name: 'Администратор',
      email: 'admin@company.com',
      password: '123',
      role: 'admin',
      department: 'IT отдел',
      position: 'Системный администратор',
      status: 'active',
      skillCoins: 0,
      lastLogin: new Date('2024-01-14T11:00:00')
    }
  })

  // Задачи
  await prisma.task.createMany({
    data: [
      {
        id: 1,
        title: 'Изучить корпоративные ценности',
        description: 'Ознакомиться с основными принципами и ценностями компании',
        priority: 'high',
        status: 'active',
        dueDate: '2024-01-15',
        coins: 25,
        category: 'Адаптация',
        progress: 0,
        mentor: 'Михаил Иванов',
        requiresApproval: true,
        employeeId: employee.id,
        employeeName: 'Эдуард Алтунбаев'
      },
      {
        id: 2,
        title: 'Встреча с наставником',
        description: 'Первая встреча с назначенным наставником для знакомства',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-01-16',
        coins: 50,
        category: 'Адаптация',
        progress: 100,
        mentor: 'Михаил Иванов',
        requiresApproval: true,
        employeeId: employee.id,
        employeeName: 'Эдуард Алтунбаев',
        submittedAt: new Date('2024-01-14T10:30:00'),
        submissionNotes: 'Встреча прошла успешно, обсудили план адаптации'
      },
      {
        id: 3,
        title: 'Заполнить профиль сотрудника',
        description: 'Внести личную информацию и контактные данные',
        priority: 'medium',
        status: 'completed',
        dueDate: '2024-01-12',
        coins: 30,
        category: 'Документы',
        progress: 100,
        mentor: 'HR-отдел',
        requiresApproval: false,
        employeeId: employee.id,
        employeeName: 'Эдуард Алтунбаев',
        approvedAt: new Date('2024-01-12T14:20:00')
      },
      {
        id: 4,
        title: 'Пройти курс по безопасности',
        description: 'Обязательное обучение по технике безопасности',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-01-18',
        coins: 40,
        category: 'Обучение',
        progress: 100,
        mentor: 'Михаил Иванов',
        requiresApproval: true,
        employeeId: employee.id,
        employeeName: 'Эдуард Алтунбаев',
        submittedAt: new Date('2024-01-13T16:45:00'),
        submissionNotes: 'Курс пройден, получен сертификат'
      },
      {
        id: 5,
        title: 'Настроить рабочее место',
        description: 'Организовать рабочее пространство и необходимое оборудование',
        priority: 'medium',
        status: 'active',
        dueDate: '2024-01-17',
        coins: 30,
        category: 'Адаптация',
        progress: 20,
        mentor: 'Михаил Иванов',
        requiresApproval: true,
        employeeId: employee.id,
        employeeName: 'Эдуард Алтунбаев'
      }
    ]
  })

  // Кандидаты
  await prisma.candidate.createMany({
    data: [
      {
        id: 'cand_1',
        name: 'Александр Волков',
        position: 'Frontend-разработчик',
        email: 'a.volkov@email.com',
        phone: '+7 (999) 123-45-67',
        experience: '5 лет',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        aiScore: 94,
        status: 'interview',
        appliedDate: '2024-01-15',
        source: 'HeadHunter'
      },
      {
        id: 'cand_2',
        name: 'Мария Соколова',
        position: 'UX/UI Дизайнер',
        email: 'm.sokolova@email.com',
        phone: '+7 (999) 234-56-78',
        experience: '3 года',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        aiScore: 89,
        status: 'screening',
        appliedDate: '2024-01-18',
        source: 'LinkedIn'
      },
      {
        id: 'cand_3',
        name: 'Дмитрий Козлов',
        position: 'Backend-разработчик',
        email: 'd.kozlov@email.com',
        phone: '+7 (999) 345-67-89',
        experience: '7 лет',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        aiScore: 91,
        status: 'new',
        appliedDate: '2024-01-20',
        source: 'Рекомендация'
      },
      {
        id: 'cand_4',
        name: 'Анна Петрова',
        position: 'Product Manager',
        email: 'a.petrova@email.com',
        phone: '+7 (999) 456-78-90',
        experience: '4 года',
        skills: ['Agile', 'Scrum', 'Jira', 'Analytics'],
        aiScore: 86,
        status: 'offer',
        appliedDate: '2024-01-10',
        source: 'HeadHunter'
      },
      {
        id: 'cand_5',
        name: 'Игорь Новиков',
        position: 'DevOps Engineer',
        email: 'i.novikov@email.com',
        phone: '+7 (999) 567-89-01',
        experience: '6 лет',
        skills: ['Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
        aiScore: 92,
        status: 'interview',
        appliedDate: '2024-01-12',
        source: 'LinkedIn'
      }
    ]
  })

  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
